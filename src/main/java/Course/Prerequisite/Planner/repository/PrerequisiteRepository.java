package Course.Prerequisite.Planner.repository;

import Course.Prerequisite.Planner.entity.Prerequisite;
import Course.Prerequisite.Planner.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PrerequisiteRepository extends JpaRepository<Prerequisite, Long> {

    List<Prerequisite> findByCourse(Course course);

    List<Prerequisite> findByPrerequisiteCourse(Course prerequisiteCourse);
}