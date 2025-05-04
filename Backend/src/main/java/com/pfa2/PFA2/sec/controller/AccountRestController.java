package com.pfa2.PFA2.sec.controller;
import com.pfa2.PFA2.dto.DailyGoalDto;
import com.pfa2.PFA2.sec.entity.AppUser;
import com.pfa2.PFA2.sec.repo.UserAppRepository;
import com.pfa2.PFA2.sec.services.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.Month;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
//@CrossOrigin(origins = "http://localhost:3000")
public class AccountRestController {
    private AccountService accountService;
    @Autowired
    private UserAppRepository userAppRepository;

    public AccountRestController(AccountService accountService) {
        this.accountService = accountService;
    }
    @GetMapping("/users")
    public List<AppUser> appUsers(){
        return accountService.getUsers();
    }
    @PostMapping("/user")
    public AppUser addUser(@RequestBody AppUser user){
        AppUser user1=accountService.loadUserByUsername(user.getUsername());
        if(user1==null)
        return accountService.addNewAccount(user);
        else
            return null;
    }
    @DeleteMapping("user/{id}")
    public void deleteUser(@PathVariable Long id){
        userAppRepository.deleteById(id);
    }
    @PutMapping("/userupdate/{id}")
    public void updateUser(@PathVariable Long id,@RequestBody AppUser user){
        accountService.updateUser(id,user);

    }
    @PutMapping("/userupdatePassword")
    public AppUser updateUserPass(@RequestBody AppUser user){
        return accountService.updatePassword(user.getEmail(),user.getPassword());

    }
    @PutMapping("/update-daily-goal")
    public ResponseEntity<Void> updateDailyGoal(
            @RequestBody DailyGoalDto goalDto,
            Principal principal) {
        AppUser user = accountService.loadUserByUsername(principal.getName());
        user.setDailyGoalMinutes(goalDto.getDailyGoalMinutes());
        accountService.updateUserObje(user);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/profil")
    public AppUser profile(Principal principal){
        return accountService.loadUserByUsername(principal.getName());
    }

}
