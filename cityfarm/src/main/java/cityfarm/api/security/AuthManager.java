package cityfarm.api.security;

import org.springframework.security.authorization.AuthorizationDecision;
import org.springframework.security.authorization.AuthorizationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.web.access.intercept.RequestAuthorizationContext;
import org.springframework.stereotype.Component;

import java.lang.reflect.Field;
import java.util.Map;
import java.util.function.Supplier;

@Component
public class AuthManager implements AuthorizationManager<RequestAuthorizationContext> {
    @Override
    public AuthorizationDecision check(Supplier<Authentication> authentication, RequestAuthorizationContext object) {
        Authentication auth = authentication.get();

        String user;
        try {
            Jwt jwt = (Jwt) auth.getPrincipal();
            user = (String) jwt.getClaims().get("preferred_username");
        } catch (ClassCastException e) {
            return new AuthorizationDecision(false);
        }


        if (user.endsWith("bristol.ac.uk") || user.endsWith("windmillhillcitfarm.org.uk")) {
            return new AuthorizationDecision(true);
        } else {
            return new AuthorizationDecision(false);
        }
    }
}
