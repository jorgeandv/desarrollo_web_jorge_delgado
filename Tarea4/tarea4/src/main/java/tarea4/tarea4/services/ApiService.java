package tarea4.tarea4.services;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import tarea4.tarea4.models.Avistamiento;
import tarea4.tarea4.models.AvistamientoRepository;
import tarea4.tarea4.models.Nota;
import tarea4.tarea4.models.NotaRepository;

@Service
public class ApiService {
    private final AvistamientoRepository avistamientoRepository;
    private final NotaRepository notaRepository;
    public ApiService(AvistamientoRepository avistamientoRepository, NotaRepository notaRepository) {
        this.avistamientoRepository = avistamientoRepository;
        this.notaRepository = notaRepository;
    }

    public List<Map<String, String>> getAvistamientos(String nombreSubString) {
        List<Avistamiento> avistamientos = avistamientoRepository.findAll();
        List<Map<String, String>> matchAvistamientos = new ArrayList<>();
        for (Avistamiento avist : avistamientos) {
            //Calza si el nombre del ave, voluntario o comuna contiene el texto del buscador buscado
            if (avist.getAve().getNombre().toLowerCase().contains(nombreSubString.toLowerCase())
                || avist.getVoluntario().getNombre().toLowerCase().contains(nombreSubString.toLowerCase())
                || avist.getVoluntario().getComuna().getNombre().toLowerCase().contains(nombreSubString.toLowerCase())) {

                //Se arma la informacion que se muestra en el buscador
                Map<String, String> avistData = new HashMap<>();
                avistData.put("id", avist.getId().toString());
                avistData.put("voluntario", avist.getVoluntario().getNombre());
                avistData.put("fecha_hora", avist.getFechaHora().toString());
                avistData.put("ave", avist.getAve().getNombre());
                avistData.put("comuna", avist.getVoluntario().getComuna().getNombre());
                avistData.put("nota", getNotaPromedio(avist));

                matchAvistamientos.add(avistData);
            }
        }
        return matchAvistamientos;
    }

    //Agrega una nota a un avistamiento. 
    // Retorna true si se guardo y false si los datos no son validos
    public Boolean agregarNota(String avistamientoId, String nota) {
        //La nota tiene que ser un entero entre 1 y 7
        if (!Nota.validateNota(nota)) {
            return false;
        }

        //El id del avistamiento tiene que ser un número!
        if (!avistamientoId.matches("[0-9]{1,9}")) {
            return false;
        }

        //El avistamiento tiene que existir en la base de datos (se busca entre todos, igual que en getAvistamientos)
        List<Avistamiento> avistamientos = avistamientoRepository.findAll();
        Avistamiento avist = null;
        for (Avistamiento a : avistamientos) {
            if (a.getId().toString().equals(avistamientoId)) {
                avist = a;
            }
        }
        if (avist == null) {
            return false;
        }

        //Se guarda la nota en la base de datos
        Nota nuevaNota = new Nota(avist, Integer.parseInt(nota));
        notaRepository.save(nuevaNota);
        return true;
    }

    //Promedio de las notas de un avistamiento o - si todavia no ha sido evaluado
    private String getNotaPromedio(Avistamiento avist) {
        List<Nota> notas = notaRepository.findByAvistamiento(avist);
        if (notas.isEmpty()) {
            return "-";
        }

        int suma = 0;
        for (Nota nota : notas) {
            suma += nota.getNota();
        }
        double promedio = (double) suma / notas.size();

        return String.valueOf(Math.round(promedio * 10) / 10.0);
    }
}
