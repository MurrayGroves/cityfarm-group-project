package cityfarm;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.http.MediaType.APPLICATION_JSON;
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
        // Try and create a cow without specifying the `alive` field or the `tb_inoculated` or the 'male' field, all of which must be non-null
        // Expect a 400 BAD REQUEST error in response.
        this.mockMvc.perform(post("/api/animals/cow/create")
                .contentType(APPLICATION_JSON)
                .content("{\"type\":  \"cow\", \"name\":  \"Bob\"}")
        ).andExpect(status().is(400));
    }
    @Test
    public void createSheepFailsIfNonNullIsNull() throws Exception {
        // Try and create a sheep without specifying the `alive` field or the `male` field, both of which must be non-null
        // Expect a 400 BAD REQUEST error in response.
        this.mockMvc.perform(post("/api/animals/sheep/create")
                .contentType(APPLICATION_JSON)
                .content("{\"type\":  \"sheep\", \"name\":  \"Hubert\"}")
        ).andExpect(status().is(400));
    }
    @Test
    public void createPigFailsIfNonNullIsNull() throws Exception {
        // Try and create a pig without specifying the `alive` field or the `male` field, both of which must be non-null
        // Expect a 400 BAD REQUEST error in response.
        this.mockMvc.perform(post("/api/animals/pig/create")
                .contentType(APPLICATION_JSON)
                .content("{\"type\":  \"pig\", \"name\":  \"Sarah\"}")
        ).andExpect(status().is(400));
    }
    @Test
    public void createGoatFailsIfNonNullIsNull() throws Exception {
        // Try and create a goat without specifying the `alive` field or the `male` field, both of which must be non-null
        // Expect a 400 BAD REQUEST error in response.
        this.mockMvc.perform(post("/api/animals/goat/create")
                .contentType(APPLICATION_JSON)
                .content("{\"type\":  \"goat\", \"name\":  \"Bill\"}")
        ).andExpect(status().is(400));
    }
    @Test
    public void createChickenFailsIfNonNullIsNull() throws Exception {
        // Try and create a chicken without specifying the `alive` field or the `male` field, both of which must be non-null
        // Expect a 400 BAD REQUEST error in response.
        this.mockMvc.perform(post("/api/animals/chicken/create")
                .contentType(APPLICATION_JSON)
                .content("{\"type\":  \"chicken\", \"name\":  \"Richard\"}")
        ).andExpect(status().is(400));
    }
}
