package com.anindita.jobportal.entity;

import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name="users")
public class User {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	@Column(length=30,nullable=false)
	private String fullName;
	@Column(nullable=false,unique=true,length=100)
	private String email;
	@Column(nullable=false)
	@JsonIgnore
	private String password;
	 @ManyToMany(fetch=FetchType.EAGER)
	 @JsonIgnore
	 @JoinTable(
			 name="users_roles",
			 joinColumns=@JoinColumn(name="user_id"),
			 inverseJoinColumns = @JoinColumn(name="role_id")
			 )
	 private Set<Role> roles;
	 public User() {
		super();
		// TODO Auto-generated constructor stub
	 }
	 public User(Long id, String fullName, String email, String password, Set<Role> roles) {
		super();
		this.id = id;
		this.fullName = fullName;
		this.email = email;
		this.password = password;
		this.roles = roles;
	 }
	 public Long getId() {
		 return id;
	 }
	 public void setId(Long id) {
		 this.id = id;
	 }
	 public String getFullName() {
		 return fullName;
	 }
	 public void setFullName(String fullName) {
		 this.fullName = fullName;
	 }
	 public String getEmail() {
		 return email;
	 }
	 public void setEmail(String email) {
		 this.email = email;
	 }
	 public String getPassword() {
		 return password;
	 }
	 public void setPassword(String password) {
		 this.password = password;
	 }
	 public Set<Role> getRoles() {
		 return roles;
	 }
	 public void setRoles(Set<Role> roles) {
		 this.roles = roles;
	 }
	 @Override
	 public String toString() {
		return "User [id=" + id + ", fullName=" + fullName + ", email=" + email + ", roles="
				+ roles + "]";
	 }
	 
	
}
