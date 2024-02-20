package himedia.project.highfourm.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import himedia.project.highfourm.dto.WorkPerformanceDTO;
import himedia.project.highfourm.dto.WorkPerformanceListDTO;
import himedia.project.highfourm.dto.WorkPerformanceResponseDTO;
import himedia.project.highfourm.service.ProductionPlanService;
import himedia.project.highfourm.service.WorkPerformanceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequiredArgsConstructor
public class WorkPerformanceController {

	private final WorkPerformanceService workPerformanceService;
	private final ProductionPlanService productionPlanService;
	
	@GetMapping("/api/work-performance")
	public ResponseEntity<List<WorkPerformanceListDTO>> workPerformance() {
		List<WorkPerformanceListDTO> WorkPerformanceList = workPerformanceService.findList();
		return ResponseEntity.ok(WorkPerformanceList);
	}
	
	@GetMapping("/api/work-performance/search")
	public ResponseEntity<List<WorkPerformanceListDTO>> searchWorkPerfomanceList(@RequestParam(value = "searchType") String searchType, @RequestParam(value = "search") String search) {
		List<WorkPerformanceListDTO> resultList = workPerformanceService.search(searchType, search);
		return ResponseEntity.ok(resultList);
	}
	
	@GetMapping("/api/work-performance/new")
	public ResponseEntity<List<WorkPerformanceResponseDTO>> workPerformanceNew() {
		List<WorkPerformanceResponseDTO> responseList = productionPlanService.findProductionPlanDetails();
		return ResponseEntity.ok(responseList);
	}
	
	@PostMapping("/api/work-performance/new")
	public ResponseEntity<String> saveWorkPerformanceAndUpdateMaterialStock(@RequestBody WorkPerformanceListDTO[] workPerformanceDTOArray) {
		for (WorkPerformanceListDTO workPerformanceDTO : workPerformanceDTOArray) {
			workPerformanceService.saveWorkPerformanceAndUpdateMaterialStock(workPerformanceDTO);
		}
		return ResponseEntity.ok("Success");
	}
}
