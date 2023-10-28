package cityfarm.api;

/**
 * Must be implemented in order for a class to represent a specific, unique animal.
 */
public interface AnimalUnique {
    String get_id();
    Long get_created_at();
}
