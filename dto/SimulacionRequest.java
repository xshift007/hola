package com.prestabanco.app.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class SimulacionRequest {
    private BigDecimal montoDeseado;
    private Integer plazo; // en años
    private BigDecimal tasaInteres; // tasa anual en porcentaje
    private String tipoPrestamo;

    // Opcionales: si quisieras manejar costos extra
    private BigDecimal seguros;       // Ej. costo de seguros
    private BigDecimal comisiones;    // Ej. comisiones fijas
}
