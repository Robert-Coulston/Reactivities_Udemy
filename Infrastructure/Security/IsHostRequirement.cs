using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Persistance;
using Microsoft.AspNetCore.Http;
using System.Linq;
using System.Security.Claims;
using System;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Security
{
    public class IsHostRequirement : IAuthorizationRequirement
    {

    }

    public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
    {
        private readonly IHttpContextAccessor _acccessor;
        private readonly DataContext _context;
        public IsHostRequirementHandler(IHttpContextAccessor acccessor, DataContext context)
        {
            _context = context;
            _acccessor = acccessor;

        }
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
        {
            var currentUser = _acccessor.HttpContext.User?.Claims?.SingleOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

            var activityId = Guid.Parse(_acccessor.HttpContext.Request.RouteValues.SingleOrDefault(x => x.Key == "id").Value.ToString());

            var activity = _context.Activities.Include(x => x.UserActivities).ThenInclude(x => x.AppUser).Where(x => x.Id == activityId).FirstOrDefault();

            var host = activity.UserActivities.FirstOrDefault(x => x.IsHost);

            if (host?.AppUser.UserName == currentUser)
            {
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }
    }
}