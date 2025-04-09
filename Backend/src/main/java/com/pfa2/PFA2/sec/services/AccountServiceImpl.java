package com.pfa2.PFA2.sec.services;

import com.pfa2.PFA2.sec.entity.AppRole;
import com.pfa2.PFA2.sec.entity.AppUser;
import com.pfa2.PFA2.sec.repo.AppRoleRepository;
import com.pfa2.PFA2.sec.repo.UserAppRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AccountServiceImpl implements AccountService {
    private final UserAppRepository userAppRepository;
    private final AppRoleRepository appRoleRepository;
    private final PasswordEncoder passwordEncoder;
    public AccountServiceImpl(UserAppRepository userAppRepository,
                              AppRoleRepository appRoleRepository,
                              PasswordEncoder passwordEncoder) {
        this.userAppRepository = userAppRepository;
        this.appRoleRepository = appRoleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void updateUser(Long id,AppUser user) {
        AppUser user1=userAppRepository.findById(id).get();
        user1.setUsername(user.getUsername());
        if(user.getPassword()!=null)
        user1.setPassword(passwordEncoder.encode(user.getPassword()));
        user1.setEmail(user.getEmail());
        userAppRepository.save(user1);

    }


    @Override
    public AppUser addNewAccount(AppUser user) {
        String password = user.getPassword();
        user.setPassword(passwordEncoder.encode(password));
        return userAppRepository.save(user);
    }

    @Override
    public AppRole addNewRole(AppRole role) {
        return appRoleRepository.save(role);
    }

    @Override
    public void addRoleToUser(String username, String role) {
        AppUser appuser = userAppRepository.findByUsername(username);
        AppRole approle = appRoleRepository.findByRolename(role);
        appuser.getRoles().add(approle);
    }

    @Override
    public AppUser loadUserByUsername(String username) {
        return userAppRepository.findByUsername(username);
    }

    @Override
    public AppUser loadUserByEmail(String email) {
        return userAppRepository.findByEmail(email);    }

    @Override
    public AppUser updatePassword(String email, String newPassword) {
        AppUser appuser = userAppRepository.findByEmail(email);
        appuser.setPassword(passwordEncoder.encode(newPassword));
        return userAppRepository.save(appuser);
    }

    @Override
    public List<AppUser> getUsers() {
        return userAppRepository.findAll();
    }
}