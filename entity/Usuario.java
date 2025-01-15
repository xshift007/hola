package com.prestabanco.app.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUsuario;

    private String nombreCompleto;
    private LocalDate fechaNacimiento;
    private String tipoIdentificacion;
    private String numeroIdentificacion;
    private String estadoCivil;
    private String direccion;
    private String numeroTelefono;
    private String correoElectronico;
    private BigDecimal ingresosMensuales;
    private String comprobanteIngresos;
    private String historialCrediticio;   // "BUENO", "REGULAR", "MALO"
    private String tipoEmpleo;
    private Integer antiguedadLaboral;     // en años
    private BigDecimal saldoCuentaAhorros;
    private String historialAhorro;
    private Integer numeroDependientes;
    private LocalDateTime fechaRegistro;
    private String estadoVerificacionDocumentos;
    private String tipoUsuario;           // "CLIENTE" o "EJECUTIVO"
    private String capacidadAhorro;       // "ADECUADA" o "INSUFICIENTE"
    private BigDecimal deudasActuales;    // Monto total de deudas actuales
}
