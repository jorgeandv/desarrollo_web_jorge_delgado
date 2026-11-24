package tarea4.tarea4.models;
import java.time.LocalDateTime;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;

@Entity
@Table
public class Avistamiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //Voluntario que informó el avistamiento (columna voluntario_id)
    @NotNull
    @ManyToOne
    private Voluntario voluntario;

    //Ave que fue avistada (columna ave_id)
    @NotNull
    @ManyToOne
    private Ave ave;

    @NotNull
    private LocalDateTime fechaHora;

    @NotNull
    private String lugar;

    public Avistamiento() {
    }

    public Avistamiento(Voluntario voluntario,
                    Ave ave,
                    LocalDateTime fechaHora,
                    String lugar) {

        this.voluntario = voluntario;
        this.ave = ave;
        this.fechaHora = fechaHora;
        this.lugar = lugar;
    }

    public Long getId() {
        return id;
    }

    public Voluntario getVoluntario() {
        return voluntario;
    }

    public Ave getAve() {
        return ave;
    }

    public LocalDateTime getFechaHora() {
        return fechaHora;
    }

    public String getLugar() {
        return lugar;
    }
}
