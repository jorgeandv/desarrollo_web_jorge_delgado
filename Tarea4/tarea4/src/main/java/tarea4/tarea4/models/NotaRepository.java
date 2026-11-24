package tarea4.tarea4.models;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotaRepository extends JpaRepository<Nota, Long> {
    //Todas las notas de un avistamiento 
    List<Nota> findByAvistamiento(Avistamiento avistamiento);
}
