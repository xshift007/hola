// src/main/java/com/prestabanco/app/entity/TipoPrestamo.java

package com.prestabanco.app.entity;

public enum TipoPrestamo {
    PRIMERA_VIVIENDA("Primera Vivienda"),
    SEGUNDA_VIVIENDA("Segunda Vivienda"),
    PROPIEDADES_COMERCIALES("Propiedades Comerciales"),
    REMODELACION("Remodelación");

    private final String descripcion;

    TipoPrestamo(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getDescripcion() {
        return descripcion;
    }
}
