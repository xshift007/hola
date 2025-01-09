package com.prestabanco.app.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class SimulacionRequest {
    private BigDecimal montoDeseado;
    private Integer plazo; // en años
    private BigDecimal tasaInteres; // tasa anual en porcentaje
    private TipoPrestamo tipoPrestamo;
}
