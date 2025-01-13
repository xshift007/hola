package com.prestabanco.app.service;

import com.prestabanco.app.config.FileStorageProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;

    @Autowired
    public FileStorageService(FileStorageProperties properties) {
        this.fileStorageLocation = Paths.get(properties.getUploadDir())
                .toAbsolutePath()
                .normalize();
        try {
            Files.createDirectories(this.fileStorageLocation.resolve("avaluos"));
            Files.createDirectories(this.fileStorageLocation.resolve("ingresos"));
        } catch (Exception ex) {
            throw new RuntimeException("No se pudo crear el directorio de almacenamiento de archivos.", ex);
        }
    }

    public String guardarArchivo(MultipartFile archivo, String carpeta) {
        String nombreArchivo = StringUtils.cleanPath(archivo.getOriginalFilename());
        try {
            if (nombreArchivo.contains("..")) {
                throw new RuntimeException("Archivo inválido: " + nombreArchivo);
            }

            Path destinoRuta = this.fileStorageLocation.resolve(carpeta).resolve(nombreArchivo);
            Files.copy(archivo.getInputStream(), destinoRuta, StandardCopyOption.REPLACE_EXISTING);
            return destinoRuta.toString();
        } catch (IOException ex) {
            throw new RuntimeException("Error al guardar el archivo " + nombreArchivo, ex);
        }
    }
}
