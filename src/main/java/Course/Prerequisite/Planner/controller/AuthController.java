package Course.Prerequisite.Planner.controller;

import Course.Prerequisite.Planner.entity.Student;
import Course.Prerequisite.Planner.repository.StudentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private StudentRepository studentRepository;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();


    // =========================
    // REGISTER
    // =========================

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Student student) {

        Optional<Student> existingStudent =
                studentRepository.findByEmail(student.getEmail());

        if (existingStudent.isPresent()) {
            return ResponseEntity.badRequest()
                    .body("Email already registered.");
        }

        String encodedPassword =
                passwordEncoder.encode(student.getPassword());

        student.setPassword(encodedPassword);

        Student savedStudent =
                studentRepository.save(student);

        Map<String, Object> response = new HashMap<>();

        response.put("message", "Registration successful");
        response.put("studentId", savedStudent.getId());
        response.put("name", savedStudent.getName());
        response.put("email", savedStudent.getEmail());

        return ResponseEntity.ok(response);
    }


    // =========================
    // LOGIN
    // =========================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Student loginRequest) {

        Optional<Student> optionalStudent =
                studentRepository.findByEmail(
                        loginRequest.getEmail()
                );

        if (optionalStudent.isEmpty()) {

            return ResponseEntity.status(401)
                    .body("Invalid email or password.");
        }

        Student student = optionalStudent.get();

        boolean passwordMatches =
                passwordEncoder.matches(
                        loginRequest.getPassword(),
                        student.getPassword()
                );

        if (!passwordMatches) {

            return ResponseEntity.status(401)
                    .body("Invalid email or password.");
        }

        Map<String, Object> response = new HashMap<>();

        response.put("message", "Login successful");
        response.put("studentId", student.getId());
        response.put("name", student.getName());
        response.put("email", student.getEmail());

        return ResponseEntity.ok(response);
    }
}