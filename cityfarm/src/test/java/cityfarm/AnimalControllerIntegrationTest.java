package cityfarm;

import cityfarm.api.AnimalController;
import cityfarm.api.AnimalGeneric;
import cityfarm.api.AnimalRepository;
import cityfarm.api.Cow;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest
public class AnimalControllerIntegrationTest {
    @Autowired
    private AnimalController animalController;

    @Before
    public void setUp() {
        Cow alice = new Cow(null, "Alice", null, null, null, true, true);
        Cow alice2 = new Cow(null, "Alice", null, null, null, true, false);
        List<AnimalGeneric> aliceCows = List.of(alice, alice2);
        Mockito.when(animalRepository.findAnimalByName("Alice")).thenReturn(aliceCows);
    }

    @MockBean
    private AnimalRepository animalRepository;

    @Test
    public void nonPresentNameEmptyList() {
        ResponseEntity<List<AnimalGeneric>> animals = animalController.get_animals_by_name("nonName");

        assertThat(animals.getStatusCode().value()).isEqualTo(200);
    }

    @Test
    public void getAnimalsByNameRightSize() {
        ResponseEntity<List<AnimalGeneric>> animals = animalController.get_animals_by_name("Alice");

        assertThat(animals.getBody().size()).isEqualTo(2);
    }
}
