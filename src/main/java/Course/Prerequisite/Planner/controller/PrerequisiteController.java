package Course.Prerequisite.Planner.controller;

import Course.Prerequisite.Planner.entity.Course;
import Course.Prerequisite.Planner.entity.Prerequisite;
import Course.Prerequisite.Planner.repository.CourseRepository;
import Course.Prerequisite.Planner.repository.PrerequisiteRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/prerequisites")
@CrossOrigin(origins = "*")
public class PrerequisiteController {

    @Autowired
    private PrerequisiteRepository prerequisiteRepository;

    @Autowired
    private CourseRepository courseRepository;

    @PostMapping("/{courseId}/{prerequisiteCourseId}")
    public ResponseEntity<?> addPrerequisite(
            @PathVariable Long courseId,
            @PathVariable Long prerequisiteCourseId) {

        // Prevent a course from being its own prerequisite
        if (courseId.equals(prerequisiteCourseId)) {
            return ResponseEntity.badRequest()
                    .body("A course cannot be its own prerequisite.");
        }

        Optional<Course> course =
                courseRepository.findById(courseId);

        Optional<Course> prerequisiteCourse =
                courseRepository.findById(prerequisiteCourseId);

        if (course.isEmpty() || prerequisiteCourse.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        // Check whether this prerequisite already exists
        List<Prerequisite> existing =
                prerequisiteRepository.findByCourse(course.get());

        for (Prerequisite p : existing) {

            if (p.getPrerequisiteCourse().getId()
                    .equals(prerequisiteCourseId)) {

                return ResponseEntity.badRequest()
                        .body("This prerequisite relationship already exists.");
            }
        }

        Prerequisite prerequisite =
                new Prerequisite(
                        course.get(),
                        prerequisiteCourse.get()
                );

        return ResponseEntity.ok(
                prerequisiteRepository.save(prerequisite)
        );
    }

    @GetMapping("/{courseId}")
    public ResponseEntity<List<Prerequisite>> getPrerequisites(
            @PathVariable Long courseId) {

        Optional<Course> course =
                courseRepository.findById(courseId);

        if (course.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<Prerequisite> prerequisites =
                prerequisiteRepository.findByCourse(course.get());

        return ResponseEntity.ok(prerequisites);
    }

    @GetMapping
    public List<Prerequisite> getAllPrerequisites() {
        return prerequisiteRepository.findAll();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePrerequisite(
            @PathVariable Long id) {

        if (!prerequisiteRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        prerequisiteRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}