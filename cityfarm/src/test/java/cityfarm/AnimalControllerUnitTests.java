package cityfarm;

import cityfarm.api.animals.*;
import cityfarm.api.schemas.AnimalSchema;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.HashMap;
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
        AnimalSchema cowSchema = new AnimalSchema("cow", new HashMap<>());
        AnimalCreateRequest animalReq = new AnimalCreateRequest();
        animalReq.alive = true;
        animalReq.name = "Alice";
        AnimalCustom alice = cowSchema.new_animal(animalReq);
        AnimalCustom alice2 = cowSchema.new_animal(animalReq);
        List<AnimalCustom> aliceCows = List.of(alice, alice2);
        Mockito.when(animalRepositoryCustom.findAnimalByName("Alice")).thenReturn(aliceCows);
        Mockito.when(animalRepository.findAnimalById("abcd-1234")).thenReturn(alice);
    }

    @MockBean
    private AnimalRepository animalRepository;

    @MockBean
    private AnimalRepositoryCustom animalRepositoryCustom;

    @Test
    public void nonPresentNameEmptyList() {
        ResponseEntity<List<AnimalCustom>> animals = animalController.get_animals_by_name("nonName", "WH");

        assertThat(animals.getStatusCode().value()).isEqualTo(200);
        assertThat(animals.getBody().size()).isEqualTo(0);
    }

    @Test
    public void getAnimalsByNameRightSize() {
        ResponseEntity<List<AnimalCustom>> animals = animalController.get_animals_by_name("Alice", "WH");

        assertThat(animals.getBody().size()).isEqualTo(2);
    }


    @Test
    public void findByIdFailsIfFakeID() {
        ResponseEntity<AnimalCustom> animal = animalController.get_animal_by_id("1234");
        assertThat(animal.getStatusCode().value()).isEqualTo(404);
    }

    @Test
    public void findByIdCorrectAnimal() {
        ResponseEntity<AnimalCustom> animal = animalController.get_animal_by_id("abcd-1234");
        assertThat(animal.getStatusCode().value()).isEqualTo(200);
        AnimalCustom cow = Objects.requireNonNull(animal.getBody());
        assertThat(cow.name).isEqualTo("Alice");
    }
}
