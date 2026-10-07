package Course.Prerequisite.Planner.repository;

import Course.Prerequisite.Planner.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Long> {

}