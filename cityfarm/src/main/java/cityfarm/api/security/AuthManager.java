package cityfarm.api.security;

import org.springframework.security.authorization.AuthorizationDecision;
import org.springframework.security.authorization.AuthorizationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.web.access.intercept.RequestAuthorizationContext;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.lang.reflect.Field;
import java.util.Map;
import java.util.function.Supplier;

@Component
public class AuthManager implements AuthorizationManager<RequestAuthorizationContext> {
    Logger logger = LoggerFactory.getLogger(AuthManager.class);

    @Override
    public AuthorizationDecision check(Supplier<Authentication> authentication, RequestAuthorizationContext object) {
        Authentication auth = authentication.get();

        String user;
        try {
            Jwt jwt = (Jwt) auth.getPrincipal();
            user = (String) jwt.getClaims().get("preferred_username");
            logger.info("Auth Claims: " + jwt.getClaims().toString());
            user = user.toLowerCase();
        } catch (ClassCastException e) {
            return new AuthorizationDecision(false);
        }


        boolean allowed = false;
        if (user.endsWith("bristol.ac.uk") || user.endsWith("windmillhillcityfarm.org.uk")) {
            allowed = true;
        } else {
            allowed = false;
        }

        logger.info("Allowed: " + allowed);

        return new AuthorizationDecision(allowed);
    }
}
