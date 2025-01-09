package com.prestabanco.app.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.*;
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

    @Enumerated(EnumType.STRING)
    private TipoPrestamo tipoPrestamo;


    private LocalDateTime fechaSolicitud;
    private BigDecimal montoSolicitado;
    private Integer plazoSolicitado; // en años
    private BigDecimal tasaInteres; // en porcentaje
    private BigDecimal relacionCuotaIngreso;
    private BigDecimal relacionDeudaIngreso;
    private String estadoSolicitud; // "EN_REVISION_INICIAL", "APROBADA", "RECHAZADA"
    private String documentosAdjuntos; // Ruta o referencia a documentos
    private String resultadoEvaluacionHistorialCrediticio;
    private BigDecimal montoFinanciamientoAprobado;
    private BigDecimal porcentajeFinanciamiento;
    private Integer edadSolicitanteAlTermino;
    private String resultadoEvaluacionAntiguedadLaboral;
    private LocalDateTime fechaAprobacionRechazo;
    private LocalDateTime fechaDesembolso;
    private String comentariosSeguimiento;

    @Transient
    private String nombreCompleto; // Campo transitorio para recibir el nombre del usuario

    // Campos adicionales para costos
    private BigDecimal cuotaMensual;
    private BigDecimal totalPagado;
    private BigDecimal totalIntereses;
}
