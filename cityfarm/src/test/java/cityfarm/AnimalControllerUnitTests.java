package cityfarm;

import cityfarm.api.AnimalController;
import cityfarm.api.AnimalGeneric;
import cityfarm.api.AnimalRepository;
import cityfarm.api.Cow;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Objects;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest
public class AnimalControllerUnitTests {
    @Autowired
    @InjectMocks
    private AnimalController animalController;

    @Before
    public void setUp() {
        Cow alice = new Cow("abcd-1234", "Alice", null, null, null, true, true);
        Cow alice2 = new Cow(null, "Alice", null, null, null, true, false);
        List<AnimalGeneric> aliceCows = List.of(alice, alice2);
        Mockito.when(animalRepository.findAnimalByName("Alice")).thenReturn(aliceCows);
        Mockito.when(animalRepository.findAnimalById("abcd-1234")).thenReturn(alice);
    }

    @MockBean
    private AnimalRepository animalRepository;

    @Test
    public void nonPresentNameEmptyList() {
        ResponseEntity<List<AnimalGeneric>> animals = animalController.get_animals_by_name("nonName");

        assertThat(animals.getStatusCode().value()).isEqualTo(200);
        assertThat(animals.getBody().size()).isEqualTo(0);
    }

    @Test
    public void getAnimalsByNameRightSize() {
        ResponseEntity<List<AnimalGeneric>> animals = animalController.get_animals_by_name("Alice");

        assertThat(animals.getBody().size()).isEqualTo(2);
    }


    @Test
    public void findByIdFailsIfFakeID() {
        ResponseEntity<AnimalGeneric> animal = animalController.get_animal_by_id("1234");
        assertThat(animal.getStatusCode().value()).isEqualTo(404);
    }

    @Test
    public void findByIdCorrectAnimal() {
        ResponseEntity<AnimalGeneric> animal = animalController.get_animal_by_id("abcd-1234");
        assertThat(animal.getStatusCode().value()).isEqualTo(200);
        AnimalGeneric cow = Objects.requireNonNull(animal.getBody());
        assertThat(cow.name).isEqualTo("Alice");
    }
}
