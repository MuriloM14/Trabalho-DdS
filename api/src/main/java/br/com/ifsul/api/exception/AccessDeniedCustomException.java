package br.com.ifsul.api.exception;

/**
 * Lançada quando o usuário autenticado tenta operar sobre um recurso que não é dele.
 * RNF003 / RNF013.
 */
public class AccessDeniedCustomException extends RuntimeException {
    public AccessDeniedCustomException(String message) {
        super(message);
    }
}
