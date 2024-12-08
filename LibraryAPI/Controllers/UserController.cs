using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;


namespace Library.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {

        private readonly UserManager<IdentityUser> _userManager;

        public UserController(UserManager<IdentityUser> userManager)
        {
            _userManager = userManager;
        }


        [HttpPost("assignRole")]
        public async Task<IActionResult> RegisterUser([FromBody] JsonObject userData)
        {

            var user = new IdentityUser() { UserName = userData["userName"].ToString() };
            var result = await _userManager.CreateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest($"Could not create user {userData["userName"]}.");
            }

            result = await _userManager.AddToRoleAsync(user, userData["role"].ToString());
            if (!result.Succeeded)
            {
                return BadRequest($"Could not assign {userData["userName"]} to role {userData["role"]}.");
            }

            return Ok(user);
        }


        [HttpGet("getUser")]
        public async Task<IActionResult> GetUserByName(string userName)
        {
            var user = await _userManager.FindByNameAsync(userName);

            if (user is null)
            {
                return BadRequest("User not found.");
            }
            return Ok(user.Id);
        }

        [HttpPost("setRole")]
        public async Task<IActionResult> SetUserRole([FromBody] JsonObject userData)
        {;
            var user = await _userManager.FindByNameAsync(userData["email"].ToString());

            if (user is null)
            {
                return BadRequest("User not found.");
            }

            var result = await _userManager.AddToRoleAsync(user, userData["role"].ToString());
            if (!result.Succeeded)
            {
                return BadRequest($"Could not assign {userData["email"]} to role {userData["role"]}.");
            }

            return Ok(user);
        }


        [HttpGet("getRole")]
        public async Task<IActionResult> GetUserRole(string userEmail)
        {
            var user = await _userManager.FindByEmailAsync(userEmail);

            if (user is null)
            {
                return BadRequest("User not found.");
            }
            var roles = await _userManager.GetRolesAsync(user);

            return Ok(roles[0]);
        }
    }
}
