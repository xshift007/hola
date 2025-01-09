// src/test/java/com/prestabanco/app/service/FileStorageServiceTest.java

package com.prestabanco.app.service;

import com.prestabanco.app.config.FileStorageProperties;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class FileStorageServiceTest {

    private FileStorageService fileStorageService;

    private Path tempDir;

    @BeforeEach
    public void setUp() throws IOException {
        // Crear un directorio temporal para las pruebas
        tempDir = Files.createTempDirectory("prestabanco_test_files");

        // Configurar las propiedades para usar el directorio temporal
        FileStorageProperties properties = new FileStorageProperties();
        properties.setUploadDir(tempDir.toString());

        // Inicializar el servicio con las propiedades
        fileStorageService = new FileStorageService(properties);
    }

    @AfterEach
    public void tearDown() throws IOException {
        // Eliminar el directorio temporal y su contenido
        if (tempDir != null && Files.exists(tempDir)) {
            Files.walk(tempDir)
                    .map(Path::toFile)
                    .forEach(file -> {
                        if (!file.delete()) {
                            file.deleteOnExit();
                        }
                    });
        }
    }

    @Test
    public void testGuardarArchivo_Exitoso() {
        // Crear un MockMultipartFile
        String contenido = "Contenido de prueba";
        MockMultipartFile archivo = new MockMultipartFile(
                "archivo",
                "prueba.txt",
                "text/plain",
                contenido.getBytes()
        );

        // Guardar el archivo en la carpeta "ingresos"
        String rutaGuardada = fileStorageService.guardarArchivo(archivo, "ingresos");

        // Verificar que el archivo se ha guardado correctamente
        Path rutaEsperada = tempDir.resolve("ingresos").resolve("prueba.txt");
        assertEquals(rutaEsperada.toString(), rutaGuardada);

        assertTrue(Files.exists(rutaEsperada));

        // Verificar el contenido del archivo
        try {
            String contenidoLeido = new String(Files.readAllBytes(rutaEsperada));
            assertEquals(contenido, contenidoLeido);
        } catch (IOException e) {
            fail("Error al leer el archivo guardado");
        }
    }

    @Test
    public void testGuardarArchivo_NombreInvalido() {
        // Crear un archivo con nombre inválido
        MockMultipartFile archivo = new MockMultipartFile(
                "archivo",
                "../prueba.txt",
                "text/plain",
                "Contenido de prueba".getBytes()
        );

        // Intentar guardar el archivo y verificar que se lanza una excepción
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            fileStorageService.guardarArchivo(archivo, "ingresos");
        });

        assertTrue(exception.getMessage().contains("Archivo inválido"));
    }

    /*
    @Test
    public void testGuardarArchivo_ErrorEscritura() throws IOException {
        // Crear un MockMultipartFile
        MockMultipartFile archivo = new MockMultipartFile(
                "archivo",
                "prueba.txt",
                "text/plain",
                "Contenido de prueba".getBytes()
        );

        // Simular que no se puede escribir en el directorio
        Path carpetaIngresos = tempDir.resolve("ingresos");
        Files.createDirectories(carpetaIngresos);
        carpetaIngresos.toFile().setWritable(false);

        // Intentar guardar el archivo y verificar que se lanza una excepción
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            fileStorageService.guardarArchivo(archivo, "ingresos");
        });

        assertTrue(exception.getMessage().contains("Error al guardar el archivo"));

        // Restaurar permisos
        carpetaIngresos.toFile().setWritable(true);
    }
*/
    @Test
    public void testConstructor_ErrorCreacionDirectorios() throws IOException {
        // Simular que no se pueden crear directorios en el path dado
        Path rutaInaccesible = tempDir.resolve(UUID.randomUUID().toString());
        Files.createFile(rutaInaccesible); // Crear un archivo en lugar de un directorio

        FileStorageProperties properties = new FileStorageProperties();
        properties.setUploadDir(rutaInaccesible.toString());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            new FileStorageService(properties);
        });

        assertTrue(exception.getMessage().contains("No se pudo crear el directorio de almacenamiento de archivos."));
    }
}
