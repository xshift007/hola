// src/main/java/com/prestabanco/app/service/SolicitudService.java

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
        solicitud.setEstadoSolicitud("EN_REVISION_INICIAL");
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

    public void eliminarSolicitud(Long id) {
         solicitudRepository.deleteById(id);
    }

    public String evaluarSolicitud(Solicitud solicitud) {
        Usuario usuario = solicitud.getUsuario();

        // R1: Relación cuota/ingreso <= 40%
        BigDecimal cuotaMensual = calcularCuotaMensual(
                solicitud.getMontoSolicitado(),
                solicitud.getPlazoSolicitado(),
                solicitud.getTasaInteres()
        );
        BigDecimal relacionCuotaIngreso = cuotaMensual.divide(usuario.getIngresosMensuales(), 2, RoundingMode.HALF_UP);
        solicitud.setRelacionCuotaIngreso(relacionCuotaIngreso);

        if (relacionCuotaIngreso.compareTo(new BigDecimal("0.40")) > 0) {
            solicitud.setEstadoSolicitud("RECHAZADA");
            solicitud.setComentariosSeguimiento("Relación cuota/ingreso excede el 40%");
            solicitudRepository.save(solicitud);
            return "RECHAZADA";
        }

        // R2: Relación deuda/ingreso <= 50%
        BigDecimal relacionDeudaIngreso = calcularRelacionDeudaIngreso(usuario);
        solicitud.setRelacionDeudaIngreso(relacionDeudaIngreso);

        if (relacionDeudaIngreso.compareTo(new BigDecimal("0.50")) > 0) {
            solicitud.setEstadoSolicitud("RECHAZADA");
            solicitud.setComentariosSeguimiento("Relación deuda/ingreso excede el 50%");
            solicitudRepository.save(solicitud);
            return "RECHAZADA";
        }

        // R3: Calificación crediticia mínima
        if (!usuario.getHistorialCrediticio().equalsIgnoreCase("BUENO")) {
            solicitud.setEstadoSolicitud("RECHAZADA");
            solicitud.setComentariosSeguimiento("Calificación crediticia insuficiente");
            solicitudRepository.save(solicitud);
            return "RECHAZADA";
        }

        // R4: Plazo <= 30 años
        if (solicitud.getPlazoSolicitado() > 30) {
            solicitud.setEstadoSolicitud("RECHAZADA");
            solicitud.setComentariosSeguimiento("Plazo solicitado excede los 30 años");
            solicitudRepository.save(solicitud);
            return "RECHAZADA";
        }

        // R5: Edad al término <= 75 años
        int edadActual = Period.between(usuario.getFechaNacimiento(), LocalDate.now()).getYears();
        int edadAlTermino = edadActual + solicitud.getPlazoSolicitado();
        solicitud.setEdadSolicitanteAlTermino(edadAlTermino);

        if (edadAlTermino > 75) {
            solicitud.setEstadoSolicitud("RECHAZADA");
            solicitud.setComentariosSeguimiento("Edad al término del préstamo excede los 75 años");
            solicitudRepository.save(solicitud);
            return "RECHAZADA";
        }

        // R6: Antigüedad laboral mínima
        if (usuario.getAntiguedadLaboral() < 2) {
            solicitud.setEstadoSolicitud("RECHAZADA");
            solicitud.setComentariosSeguimiento("Antigüedad laboral insuficiente");
            solicitudRepository.save(solicitud);
            return "RECHAZADA";
        }

        // R7: Capacidad de ahorro demostrada
        if (usuario.getCapacidadAhorro() == null || !usuario.getCapacidadAhorro().equalsIgnoreCase("ADECUADA")) {
            solicitud.setEstadoSolicitud("RECHAZADA");
            solicitud.setComentariosSeguimiento("Capacidad de ahorro insuficiente");
            solicitudRepository.save(solicitud);
            return "RECHAZADA";
        }

        // Cálculo de Costos Totales (Agregar aquí)
        calcularCostosTotales(solicitud);

        // Si pasa todas las evaluaciones
        solicitud.setEstadoSolicitud("APROBADA");
        solicitud.setFechaAprobacionRechazo(LocalDateTime.now());
        solicitud.setComentariosSeguimiento("Solicitud aprobada");
        solicitudRepository.save(solicitud);
        return "APROBADA";
    }

    private BigDecimal calcularCuotaMensual(BigDecimal monto, Integer plazoAnios, BigDecimal tasaAnual) {
        Integer plazoMeses = plazoAnios * 12;
        BigDecimal tasaMensual = tasaAnual.divide(BigDecimal.valueOf(12 * 100), 10, RoundingMode.HALF_UP);
        BigDecimal unoMasR = BigDecimal.ONE.add(tasaMensual);
        BigDecimal potencia = unoMasR.pow(plazoMeses, MathContext.DECIMAL128);
        BigDecimal cuotaMensual = monto.multiply(tasaMensual.multiply(potencia))
                .divide(potencia.subtract(BigDecimal.ONE), 2, RoundingMode.HALF_UP);
        return cuotaMensual;
    }

    private BigDecimal calcularRelacionDeudaIngreso(Usuario usuario) {
        BigDecimal deudas = usuario.getDeudasActuales() != null ? usuario.getDeudasActuales() : BigDecimal.ZERO;
        return deudas.divide(usuario.getIngresosMensuales(), 2, RoundingMode.HALF_UP);
    }

    private void calcularCostosTotales(Solicitud solicitud) {
        BigDecimal monto = solicitud.getMontoSolicitado();
        Integer plazoAnios = solicitud.getPlazoSolicitado();
        BigDecimal tasaAnual = solicitud.getTasaInteres();

        // Cuota Mensual
        BigDecimal cuotaMensual = calcularCuotaMensual(monto, plazoAnios, tasaAnual);
        solicitud.setCuotaMensual(cuotaMensual);

        // Seguros
        BigDecimal seguroDesgravamen = monto.multiply(new BigDecimal("0.0003")).multiply(BigDecimal.valueOf(plazoAnios * 12));
        BigDecimal seguroIncendio = new BigDecimal("20000").multiply(BigDecimal.valueOf(plazoAnios * 12));

        // Comisión por Administración
        BigDecimal comisionAdministracion = monto.multiply(new BigDecimal("0.01"));

        // Costo Total Mensual
        BigDecimal costoMensual = cuotaMensual.add(seguroDesgravamen.divide(BigDecimal.valueOf(plazoAnios * 12), 2, RoundingMode.HALF_UP))
                                                  .add(seguroIncendio.divide(BigDecimal.valueOf(plazoAnios * 12), 2, RoundingMode.HALF_UP));

        // Costo Total durante la Vida del Préstamo
        BigDecimal costoTotal = costoMensual.multiply(BigDecimal.valueOf(plazoAnios * 12))
                                            .add(comisionAdministracion);

        solicitud.setTotalPagado(costoTotal);
        solicitud.setTotalIntereses(costoTotal.subtract(monto));
    }
}
