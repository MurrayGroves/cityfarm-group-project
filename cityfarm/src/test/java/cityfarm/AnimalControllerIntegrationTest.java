package cityfarm;

import cityfarm.api.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
public class AnimalControllerIntegrationTest {
    @Autowired
    private MockMvc mockMvc;

    @Test
    public void createCowFailsIfNonNullIsNull() throws Exception {
        // Try and create a cow without specifying the `alive` field or the `tb_inoculated` field, both of which must be non-null
        // Expect a 400 BAD REQUEST error in response.
        this.mockMvc.perform(post("/api/animals/cow/create")
                .contentType(APPLICATION_JSON)
                .content("{\"type\":  \"cow\", \"name\":  \"Bob\"}")
        ).andExpect(status().is(400));
    }
}
