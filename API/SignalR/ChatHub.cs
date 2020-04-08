using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Application.Comments;
using Application.User;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class ChatHub : Hub
    {
        private readonly IMediator _mediator;
        public ChatHub(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task SendComment(Create.Command command)
        {
            string userName = GetUserName();

            command.UserName = userName;
            var comment = await _mediator.Send(command);

            await Clients.Group(command.ActivityId.ToString()).SendAsync("ReceiveComment", comment);
        }

        private string GetUserDisplayName()
        {
            var user = _mediator.Send(new CurrentUser.Query()).Result;
            return user.DisplayName;
        }
        private string GetUserName()
        {
            var userName = Context.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
            return userName;
        }
        public async Task AddToGroup(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            var userDisplayName = GetUserDisplayName();
            await Clients.Group(groupName).SendAsync("Send", $"{userDisplayName} has joined the group");
        }

        public async Task RemoveFromGroup(string groupName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
            var userDisplayName = GetUserDisplayName();
            await Clients.Group(groupName).SendAsync("Send", $"{userDisplayName} has left the group");
        }
    }
}