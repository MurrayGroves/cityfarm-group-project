package cityfarm;


//import cityfarm.api.AnimalController;
//import cityfarm.api.AnimalGeneric;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@SpringBootApplication
@EnableMongoRepositories
public class CityFarmApplication {
    public static void main(String[] args) {
        SpringApplication.run(CityFarmApplication.class, args);
    }
}
