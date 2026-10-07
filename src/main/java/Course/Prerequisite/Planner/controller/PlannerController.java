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
@RequestMapping("/api/planner")
@CrossOrigin(origins = "*")
public class PlannerController {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private PrerequisiteRepository prerequisiteRepository;

    // Generate complete learning path for a course
    @GetMapping("/{courseId}")
    public ResponseEntity<List<Course>> getLearningPath(
            @PathVariable Long courseId) {

        Optional<Course> course = courseRepository.findById(courseId);

        if (course.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<Course> learningPath = new ArrayList<>();
        Set<Long> visited = new HashSet<>();

        buildLearningPath(course.get(), learningPath, visited);

        return ResponseEntity.ok(learningPath);
    }

    // Recursive method to find all prerequisites
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