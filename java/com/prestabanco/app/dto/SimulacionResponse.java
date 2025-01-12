package com.prestabanco.app.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class SimulacionResponse {
    private BigDecimal cuotaMensual;
    private BigDecimal totalPagado;
    private BigDecimal totalIntereses;

    // Campos adicionales opcionales
    private BigDecimal costosAdicionales;
    private BigDecimal totalFinal;
}
