package com.anindita.jobportal.service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ResumeStorageService {

    private static final long MAX_RESUME_BYTES = 10L * 1024L * 1024L;

    private final Path resumeUploadDirectory;

    public ResumeStorageService(
            @Value("${intellihire.resume-upload-dir:uploads/resumes}")
            String resumeUploadDirectory) {

        this.resumeUploadDirectory = Paths.get(resumeUploadDirectory);
    }

    public StoredResume store(MultipartFile resume) {

        validateResume(resume);

        String originalName = safeOriginalFilename(
                resume.getOriginalFilename()
        );

        Path uploadDirectory =
                resumeUploadDirectory.toAbsolutePath().normalize();

        Path storedFile = uploadDirectory
                .resolve(UUID.randomUUID() + ".pdf")
                .normalize();

        if (!storedFile.startsWith(uploadDirectory)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid resume filename."
            );
        }

        try {
            Files.createDirectories(uploadDirectory);

            resume.transferTo(storedFile.toFile());

            return new StoredResume(
                    originalName,
                    storedFile
            );

        } catch (IOException e) {

            deleteQuietly(storedFile);

            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "The resume could not be stored."
            );
        }
    }

    public StoredFile load(String storedPath) {

        if (storedPath == null || storedPath.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "No resume is stored for this application."
            );
        }

        Path uploadDirectory =
                resumeUploadDirectory.toAbsolutePath().normalize();

        Path resumePath = Paths.get(storedPath)
                .toAbsolutePath()
                .normalize();

        if (!resumePath.startsWith(uploadDirectory)
                || !Files.isRegularFile(resumePath)) {

            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "The resume file is unavailable."
            );
        }

        return new StoredFile(resumePath);
    }

    public void deleteQuietly(StoredResume storedResume) {

        if (storedResume == null || storedResume.path() == null) {
            return;
        }

        deleteQuietly(storedResume.path());
    }

    private static void deleteQuietly(Path file) {

        if (file == null) {
            return;
        }

        try {
            Files.deleteIfExists(file);
        } catch (IOException ignored) {
            // Best-effort cleanup.
        }
    }

    private static void validateResume(MultipartFile resume) {

        if (resume == null || resume.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A PDF resume is required."
            );
        }

        if (resume.getSize() > MAX_RESUME_BYTES) {
            throw new ResponseStatusException(
                    HttpStatus.PAYLOAD_TOO_LARGE,
                    "The resume must be 10 MB or smaller."
            );
        }

        if (!"application/pdf".equalsIgnoreCase(
                resume.getContentType())) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Only PDF resumes are accepted."
            );
        }

        try (var input = resume.getInputStream()) {

            byte[] signature = input.readNBytes(5);

            if (!Arrays.equals(
                    signature,
                    "%PDF-".getBytes(StandardCharsets.US_ASCII))) {

                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "The uploaded file is not a valid PDF."
                );
            }

        } catch (IOException e) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "The resume could not be read."
            );
        }
    }

    private static String safeOriginalFilename(String originalName) {

        if (originalName == null || originalName.isBlank()) {
            return "resume.pdf";
        }

        String filename = originalName.replace('\\', '/');

        filename = filename.substring(
                filename.lastIndexOf('/') + 1
        );

        filename = filename
                .replaceAll("[\\p{Cntrl}]", "_")
                .trim();

        if (filename.isBlank()
                || !filename.toLowerCase().endsWith(".pdf")) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "The resume filename must end in .pdf."
            );
        }

        return filename.length() > 200
                ? filename.substring(0, 200)
                : filename;
    }

    public record StoredResume(
            String originalFileName,
            Path path
    ) {
    }

    public record StoredFile(
            Path path
    ) {
    }
}