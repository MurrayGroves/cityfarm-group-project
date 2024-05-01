package cityfarm.api.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.CorsUtils;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Objects;

@Configuration
public class SecurityConfig {

    @Autowired
    AuthManager authManager;

    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("https://cityfarm.murraygrov.es", "http://localhost:3000", "*"));
        configuration.setAllowedMethods(Arrays.asList("GET","POST", "OPTIONS", "DELETE", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("authorization", "content-type"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(final HttpSecurity http) throws Exception {
        System.out.println("auth: " + System.getenv("auth"));
        String auth_enabled = Objects.requireNonNullElse(System.getenv("auth"), "false");
        if (auth_enabled.equals("false")) {
            System.out.println("auth disabled");
            return http
                    .cors(cors ->
                            cors.configurationSource(corsConfigurationSource())
                    ).csrf(AbstractHttpConfigurer::disable)
                    .authorizeHttpRequests(authorizeRequests ->
                            authorizeRequests.requestMatchers(CorsUtils::isPreFlightRequest).permitAll()
                                    .anyRequest().permitAll()
                    )
                    .build();
        }

        return http
                .cors(cors ->
                    cors.configurationSource(corsConfigurationSource())
                ).csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authorizeRequests ->
                        authorizeRequests.requestMatchers(CorsUtils::isPreFlightRequest).permitAll()
                                .anyRequest().access(authManager)
                )
                .oauth2ResourceServer((oauth2) -> oauth2.jwt(Customizer.withDefaults()))
                .build();
    }
}