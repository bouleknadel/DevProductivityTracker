package com.pfa2.PFA2.sec.services;



import com.pfa2.PFA2.sec.entity.AppRole;
import com.pfa2.PFA2.sec.entity.AppUser;

import java.util.List;

public interface AccountService {
    AppUser addNewAccount(AppUser user);
    AppRole addNewRole(AppRole role);
    void addRoleToUser(String username, String role);
    AppUser loadUserByUsername(String username);
    AppUser loadUserByEmail(String email);
    AppUser updatePassword(String username, String newPassword);
    List<AppUser> getUsers();
    public void updateUser(Long id,AppUser user);
}
