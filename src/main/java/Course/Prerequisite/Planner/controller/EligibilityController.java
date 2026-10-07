package Course.Prerequisite.Planner.controller;

import Course.Prerequisite.Planner.entity.Course;
import Course.Prerequisite.Planner.entity.Prerequisite;
import Course.Prerequisite.Planner.repository.CourseRepository;
import Course.Prerequisite.Planner.repository.PrerequisiteRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/eligibility")
@CrossOrigin(origins = "*")
public class EligibilityController {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private PrerequisiteRepository prerequisiteRepository;

    @GetMapping("/{courseId}")
    public ResponseEntity<Map<String, Object>> checkEligibility(
            @PathVariable Long courseId,
            @RequestParam(required = false) List<Long> completed) {

        Optional<Course> course = courseRepository.findById(courseId);

        if (course.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        if (completed == null) {
            completed = new ArrayList<>();
        }

        List<Course> learningPath = new ArrayList<>();
        Set<Long> visited = new HashSet<>();

        buildLearningPath(course.get(), learningPath, visited);

        List<Course> missingCourses = new ArrayList<>();

        for (Course c : learningPath) {

            if (!c.getId().equals(courseId)
                    && !completed.contains(c.getId())) {

                missingCourses.add(c);
            }
        }

        boolean eligible = missingCourses.isEmpty();

        Map<String, Object> response = new LinkedHashMap<>();

        response.put("course", course);
        response.put("eligible", eligible);
        response.put("missingPrerequisites", missingCourses);

        return ResponseEntity.ok(response);
    }

    private void buildLearningPath(
            Course course,
            List<Course> learningPath,
            Set<Long> visited) {

        if (visited.contains(course.getId())) {
            return;
        }

        visited.add(course.getId());

        List<Prerequisite> prerequisites =
                prerequisiteRepository.findByCourse(course);

        for (Prerequisite prerequisite : prerequisites) {

            buildLearningPath(
                    prerequisite.getPrerequisiteCourse(),
                    learningPath,
                    visited
            );
        }

        learningPath.add(course);
    }
}