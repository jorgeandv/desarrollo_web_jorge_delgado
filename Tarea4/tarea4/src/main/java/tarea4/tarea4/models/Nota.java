package tarea4.tarea4.models;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;

@Entity
@Table
public class Nota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //Avistamiento al que pertenece la nota (columna avistamiento_id)
    @NotNull
    @ManyToOne
    private Avistamiento avistamiento;

    @NotNull
    private Integer nota;

    public Nota() {
    }

    public Nota(Avistamiento avistamiento, Integer nota) {
        this.avistamiento = avistamiento;
        this.nota = nota;
    }

    public Long getId() {
        return id;
    }

    public Avistamiento getAvistamiento() {
        return avistamiento;
    }

    public Integer getNota() {
        return nota;
    }

    //La nota tiene que ser un numero entero entre 1 y 7
    public static Boolean validateNota(String nota) {
        return nota.matches("[1-7]");
    }
}
