package com.prestabanco.app;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.test.context.ActiveProfiles;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
class PrestaBancoAppApplicationTests {

	@Test
	void contextLoads() {
		// Prueba vacía para verificar que el contexto carga correctamente con el perfil de pruebas.
	}
}
