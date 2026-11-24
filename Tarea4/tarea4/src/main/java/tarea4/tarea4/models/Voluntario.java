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
public class Voluntario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private String nombre;

    //Cada voluntario es de una comuna (columna comuna_id de la tabla voluntario)
    @NotNull
    @ManyToOne
    private Comuna comuna;

    public Voluntario() {
    }

    public Voluntario(String nombre, Comuna comuna) {
        this.nombre = nombre;
        this.comuna = comuna;
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public Comuna getComuna() {
        return comuna;
    }
}