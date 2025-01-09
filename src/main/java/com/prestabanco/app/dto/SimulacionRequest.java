// src/main/java/com/prestabanco/app/dto/SimulacionRequest.java

package com.prestabanco.app.dto;

import com.prestabanco.app.entity.TipoPrestamo;
import lombok.Data;


import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

@Data
public class SimulacionRequest {
    @NotNull(message = "El monto deseado es requerido")
    @DecimalMin(value = "0.01", inclusive = true, message = "El monto debe ser mayor que 0")
    private BigDecimal montoDeseado;

    @NotNull(message = "El plazo es requerido")
    @Min(value = 1, message = "El plazo debe ser al menos 1 año")
    @Max(value = 30, message = "El plazo no puede exceder los 30 años")
    private Integer plazo; // en años

    @NotNull(message = "La tasa de interés es requerida")
    @DecimalMin(value = "0.01", inclusive = true, message = "La tasa de interés debe ser mayor que 0")
    private BigDecimal tasaInteres; // tasa anual en porcentaje

    @NotNull(message = "El tipo de préstamo es requerido")
    private TipoPrestamo tipoPrestamo;
}
