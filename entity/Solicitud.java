package com.prestabanco.app.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "solicitudes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Solicitud {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idSolicitud;

    @ManyToOne
    @JoinColumn(name = "idUsuario")
    private Usuario usuario;

    private LocalDateTime fechaSolicitud;
    private String tipoPrestamo;
    private BigDecimal montoSolicitado;
    private Integer plazoSolicitado; // en años
    private BigDecimal tasaInteres;  // en porcentaje

    // Nuevo campo para relacionar valor de la propiedad
    private BigDecimal valorPropiedad;

    private BigDecimal relacionCuotaIngreso;
    private BigDecimal relacionDeudaIngreso;

    /**
     * Estados posibles (E1..E9) según enunciado:
     * E1: Revisión inicial
     * E2: Pendiente de documentación
     * E3: En evaluación
     * E4: Pre-aprobada
     * E5: En aprobación final
     * E6: Aprobada
     * E7: Rechazada
     * E8: Cancelada
     * E9: En desembolso
     */
    private String estadoSolicitud;

    private String documentosAdjuntos;  // Rutas a documentos
    private String resultadoEvaluacionHistorialCrediticio;
    private BigDecimal montoFinanciamientoAprobado;
    private BigDecimal porcentajeFinanciamiento;
    private Integer edadSolicitanteAlTermino;
    private String resultadoEvaluacionAntiguedadLaboral;
    private LocalDateTime fechaAprobacionRechazo;
    private LocalDateTime fechaDesembolso;
    private String comentariosSeguimiento;

    @Transient
    private String nombreCompleto; // Campo auxiliar (no persistente)
}
