package tarea4.tarea4.controllers;

import org.springframework.web.bind.annotation.RestController;
import tarea4.tarea4.services.ApiService;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
public class ApiController {
    private final ApiService apiService;
    public ApiController(ApiService apiService) {
        this.apiService = apiService;

    }

    @GetMapping("/get-avistamientos/{nombre_substring}")
    public Map<String, List<Map<String, String>>> getAvistamientosEndpoint(@PathVariable("nombre_substring") String nombreSubstring) {
        List<Map<String, String>> avistamientos = apiService.getAvistamientos(nombreSubstring);
        return Map.of("data", avistamientos); //Encapsula la lista en un mapa con llave "data"
    }

    //Agrega una nota a un avistamiento (lo llama el search-bar.js usando fetch)
    @PostMapping("/agregar-nota")
    public Map<String, String> agregarNotaEndpoint(
        @RequestParam("avistamiento_id") String avistamientoId,
        @RequestParam("nota") String nota) {

        //Se valida en el servidor, si los datos no son validos no se guarda nada
        if (!apiService.agregarNota(avistamientoId, nota)) {
            return Map.of("status", "error", "data", "No se pudo agregar la nota. Debe ser un número entero entre 1 y 7.");
        }
        return Map.of("status", "ok");
    }
}
