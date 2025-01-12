package com.prestabanco.app.service;

import com.prestabanco.app.entity.Solicitud;
import com.prestabanco.app.entity.Usuario;
import com.prestabanco.app.exception.BusinessException;
import com.prestabanco.app.repository.SolicitudRepository;
import com.prestabanco.app.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.List;
import java.util.Optional;

@Service
public class SolicitudService {

    @Autowired
    private SolicitudRepository solicitudRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Solicitud crearSolicitud(Solicitud solicitud) {
        solicitud.setFechaSolicitud(LocalDateTime.now());
        // Asignamos por defecto E1: Revisión inicial
        solicitud.setEstadoSolicitud("E1_REVISION_INICIAL");
        return solicitudRepository.save(solicitud);
    }

    public Optional<Solicitud> obtenerSolicitudPorId(Long idSolicitud) {
        return solicitudRepository.findById(idSolicitud);
    }

    public List<Solicitud> obtenerSolicitudesPorUsuario(Usuario usuario) {
        return solicitudRepository.findByUsuario(usuario);
    }

    public List<Solicitud> obtenerTodasLasSolicitudes() {
        return solicitudRepository.findAll();
    }

    public Solicitud actualizarSolicitud(Solicitud solicitud) {
        return solicitudRepository.save(solicitud);
    }

    /**
     * Invocado normalmente desde un endpoint /api/solicitudes/{id}/evaluar
     * Aplica las validaciones de negocio para ver si se APRUEBA o RECHAZA.
     */
    public String evaluarSolicitud(Solicitud solicitud) {
        // 1) Validaciones por tipo de préstamo
        validarCondicionesPorTipo(solicitud);

        // 2) Reglas del enunciado (R1..R7)

        Usuario usuario = solicitud.getUsuario();
        if (usuario == null) {
            throw new BusinessException("No hay un usuario asociado a la solicitud.");
        }

        // R1: Relación cuota/ingreso <= 40%
        BigDecimal cuotaMensual = calcularCuotaMensual(
                solicitud.getMontoSolicitado(),
                solicitud.getPlazoSolicitado(),
                solicitud.getTasaInteres()
        );
        BigDecimal relacionCuotaIngreso = BigDecimal.ZERO;
        if (usuario.getIngresosMensuales() != null && usuario.getIngresosMensuales().compareTo(BigDecimal.ZERO) > 0) {
            relacionCuotaIngreso = cuotaMensual.divide(usuario.getIngresosMensuales(), 4, RoundingMode.HALF_UP);
        }
        solicitud.setRelacionCuotaIngreso(relacionCuotaIngreso);

        if (relacionCuotaIngreso.compareTo(new BigDecimal("0.40")) > 0) {
            solicitud.setEstadoSolicitud("E7_RECHAZADA");
            solicitud.setComentariosSeguimiento("Relación cuota/ingreso excede el 40%");
            solicitudRepository.save(solicitud);
            return "RECHAZADA";
        }

        // R2: Relación deuda/ingreso <= 50%
        BigDecimal relacionDeudaIngreso = calcularRelacionDeudaIngreso(usuario);
        solicitud.setRelacionDeudaIngreso(relacionDeudaIngreso);

        if (relacionDeudaIngreso.compareTo(new BigDecimal("0.50")) > 0) {
            solicitud.setEstadoSolicitud("E7_RECHAZADA");
            solicitud.setComentariosSeguimiento("Relación deuda/ingreso excede el 50%");
            solicitudRepository.save(solicitud);
            return "RECHAZADA";
        }

        // R3: Historial crediticio mínimo "BUENO"
        if (!"BUENO".equalsIgnoreCase(usuario.getHistorialCrediticio())) {
            solicitud.setEstadoSolicitud("E7_RECHAZADA");
            solicitud.setComentariosSeguimiento("Calificación crediticia insuficiente");
            solicitudRepository.save(solicitud);
            return "RECHAZADA";
        }

        // R4: Plazo <= 30 años
        if (solicitud.getPlazoSolicitado() != null && solicitud.getPlazoSolicitado() > 30) {
            solicitud.setEstadoSolicitud("E7_RECHAZADA");
            solicitud.setComentariosSeguimiento("Plazo solicitado excede los 30 años");
            solicitudRepository.save(solicitud);
            return "RECHAZADA";
        }

        // R5: Edad al término <= 75 años
        int edadActual = 0;
        if (usuario.getFechaNacimiento() != null) {
            edadActual = Period.between(usuario.getFechaNacimiento(), LocalDate.now()).getYears();
        }
        int edadAlTermino = edadActual + (solicitud.getPlazoSolicitado() == null ? 0 : solicitud.getPlazoSolicitado());
        solicitud.setEdadSolicitanteAlTermino(edadAlTermino);

        if (edadAlTermino > 75) {
            solicitud.setEstadoSolicitud("E7_RECHAZADA");
            solicitud.setComentariosSeguimiento("Edad al término del préstamo excede los 75 años");
            solicitudRepository.save(solicitud);
            return "RECHAZADA";
        }

        // R6: Antigüedad laboral mínima (ej. 2 años)
        if (usuario.getAntiguedadLaboral() == null || usuario.getAntiguedadLaboral() < 2) {
            solicitud.setEstadoSolicitud("E7_RECHAZADA");
            solicitud.setComentariosSeguimiento("Antigüedad laboral insuficiente");
            solicitudRepository.save(solicitud);
            return "RECHAZADA";
        }

        // R7: Capacidad de ahorro "ADECUADA"
        if (!"ADECUADA".equalsIgnoreCase(usuario.getCapacidadAhorro())) {
            solicitud.setEstadoSolicitud("E7_RECHAZADA");
            solicitud.setComentariosSeguimiento("Capacidad de ahorro insuficiente");
            solicitudRepository.save(solicitud);
            return "RECHAZADA";
        }

        // Si pasa todas las evaluaciones:
        solicitud.setEstadoSolicitud("E6_APROBADA");
        solicitud.setFechaAprobacionRechazo(LocalDateTime.now());
        solicitud.setComentariosSeguimiento("Solicitud aprobada");
        solicitudRepository.save(solicitud);
        return "APROBADA";
    }

    /**
     * Valida las reglas particulares según el tipo de préstamo (Plazo máx, rango de tasas, % de financiamiento).
     */
    private void validarCondicionesPorTipo(Solicitud solicitud) {
        if (solicitud.getTipoPrestamo() == null) return;

        String tipo = solicitud.getTipoPrestamo().toUpperCase();
        BigDecimal valorPropiedad = solicitud.getValorPropiedad();
        BigDecimal montoSolicitado = solicitud.getMontoSolicitado();
        BigDecimal tasa = solicitud.getTasaInteres();
        Integer plazo = solicitud.getPlazoSolicitado();

        switch (tipo) {
            case "PRIMERA VIVIENDA":
                // Plazo máximo 30
                if (plazo != null && plazo > 30) {
                    throw new BusinessException("El plazo excede los 30 años para Primera Vivienda.");
                }
                // Tasa de interés entre 3.5% y 5.0%
                if (tasa.compareTo(new BigDecimal("3.5")) < 0
                        || tasa.compareTo(new BigDecimal("5.0")) > 0) {
                    throw new BusinessException("Tasa fuera del rango [3.5%, 5.0%] para Primera Vivienda.");
                }
                // Monto máximo 80% del valor de la propiedad
                if (valorPropiedad != null && valorPropiedad.compareTo(BigDecimal.ZERO) > 0) {
                    BigDecimal maxFin = valorPropiedad.multiply(new BigDecimal("0.80"));
                    if (montoSolicitado.compareTo(maxFin) > 0) {
                        throw new BusinessException("El monto solicitado excede el 80% del valor de la propiedad.");
                    }
                }
                break;

            case "SEGUNDA VIVIENDA":
                // Plazo máximo 20, tasa 4.0%-6.0%, 70% del valor de la propiedad
                if (plazo != null && plazo > 20) {
                    throw new BusinessException("El plazo excede los 20 años para Segunda Vivienda.");
                }
                if (tasa.compareTo(new BigDecimal("4.0")) < 0
                        || tasa.compareTo(new BigDecimal("6.0")) > 0) {
                    throw new BusinessException("Tasa fuera del rango [4.0%, 6.0%] para Segunda Vivienda.");
                }
                if (valorPropiedad != null && valorPropiedad.compareTo(BigDecimal.ZERO) > 0) {
                    BigDecimal maxFin = valorPropiedad.multiply(new BigDecimal("0.70"));
                    if (montoSolicitado.compareTo(maxFin) > 0) {
                        throw new BusinessException("Excede el 70% del valor de la propiedad.");
                    }
                }
                break;

            case "PROPIEDADES COMERCIALES":
                // Plazo máx 25, tasa 5.0%-7.0%, 60% del valor
                if (plazo != null && plazo > 25) {
                    throw new BusinessException("El plazo excede los 25 años para Propiedades Comerciales.");
                }
                if (tasa.compareTo(new BigDecimal("5.0")) < 0
                        || tasa.compareTo(new BigDecimal("7.0")) > 0) {
                    throw new BusinessException("Tasa fuera del rango [5.0%, 7.0%] para Propiedades Comerciales.");
                }
                if (valorPropiedad != null && valorPropiedad.compareTo(BigDecimal.ZERO) > 0) {
                    BigDecimal maxFin = valorPropiedad.multiply(new BigDecimal("0.60"));
                    if (montoSolicitado.compareTo(maxFin) > 0) {
                        throw new BusinessException("Excede el 60% del valor de la propiedad.");
                    }
                }
                break;

            case "REMODELACIÓN":
                // Plazo máx 15, tasa 4.5%-6.0%, 50% del valor actual
                if (plazo != null && plazo > 15) {
                    throw new BusinessException("El plazo excede los 15 años para Remodelación.");
                }
                if (tasa.compareTo(new BigDecimal("4.5")) < 0
                        || tasa.compareTo(new BigDecimal("6.0")) > 0) {
                    throw new BusinessException("Tasa fuera del rango [4.5%, 6.0%] para Remodelación.");
                }
                if (valorPropiedad != null && valorPropiedad.compareTo(BigDecimal.ZERO) > 0) {
                    BigDecimal maxFin = valorPropiedad.multiply(new BigDecimal("0.50"));
                    if (montoSolicitado.compareTo(maxFin) > 0) {
                        throw new BusinessException("Excede el 50% del valor de la propiedad.");
                    }
                }
                break;

            default:
                // No coincide con los 4 tipos principales, se asume genérico o se lanza error
                throw new BusinessException("Tipo de préstamo desconocido o no soportado: " + tipo);
        }
    }

    private BigDecimal calcularCuotaMensual(BigDecimal monto, Integer plazoAnios, BigDecimal tasaAnual) {
        if (plazoAnios == null || plazoAnios == 0) return BigDecimal.ZERO;
        if (tasaAnual == null) return BigDecimal.ZERO;

        int plazoMeses = plazoAnios * 12;
        // Dividir la tasaAnual entre 12*100 para convertir a decimal mensual
        BigDecimal tasaMensual = tasaAnual.divide(BigDecimal.valueOf(12 * 100), 10, RoundingMode.HALF_UP);

        BigDecimal unoMasR = BigDecimal.ONE.add(tasaMensual);
        BigDecimal potencia = unoMasR.pow(plazoMeses, MathContext.DECIMAL128);

        BigDecimal cuotaMensual = monto.multiply(tasaMensual.multiply(potencia))
                .divide(potencia.subtract(BigDecimal.ONE), 2, RoundingMode.HALF_UP);

        return cuotaMensual;
    }

    private BigDecimal calcularRelacionDeudaIngreso(Usuario usuario) {
        BigDecimal deudas = usuario.getDeudasActuales() != null ? usuario.getDeudasActuales() : BigDecimal.ZERO;
        if (usuario.getIngresosMensuales() == null ||
                usuario.getIngresosMensuales().compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return deudas.divide(usuario.getIngresosMensuales(), 4, RoundingMode.HALF_UP);
    }
}
