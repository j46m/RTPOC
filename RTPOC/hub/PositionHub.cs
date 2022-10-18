using Microsoft.AspNetCore.SignalR;

namespace RTPOC.hub;

public class PositionHub : Hub
{
    public async Task SendPosition(int left, int top)
    {
        await Clients.Others.SendAsync("ReceivePosition",left,top);
    }
}