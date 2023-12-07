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

    @GetMapping("/")
    public String home() {
        return "index";
    }

    /*
    @GetMapping("/animals")
    public  String animals(Model model){
        AnimalController james = new AnimalController();
        model.addAttribute("animals",james.get_animals());
        return"animals";
    }
    */
}
