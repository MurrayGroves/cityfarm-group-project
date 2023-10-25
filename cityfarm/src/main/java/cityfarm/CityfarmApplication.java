package cityfarm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@SpringBootApplication
public class CityfarmApplication {

	public static void main(String[] args) {
		SpringApplication.run(CityfarmApplication.class, args);
	}

	@GetMapping("/")
	public String mainPage() {
		return "2023-CityFarm\n";
	}

}
