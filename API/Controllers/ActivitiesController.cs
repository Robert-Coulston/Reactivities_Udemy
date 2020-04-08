using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Activities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{

    public class ActivitiesController : BaseController
    {

        [HttpGet]
        public async Task<ActionResult<List.ActivitiesEnvelope>> List(int? limit, int? offset)
        {
            //return await _activityService.GetActivities();
            return await Mediator.Send(new List.Query(limit, offset));
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<ActivityDto>> Details(Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
             return await Mediator.Send(new Details.Query {Id = id});
        }

        [HttpPost]
        public async Task<ActionResult<Unit>> Create([FromBody]Create.Command command) 
        {
            return await Mediator.Send(command);
        }

        [HttpPut("{id:guid}")]
        [Authorize(Policy = "IsActivityHost")]
        public async Task<ActionResult<Unit>> Edit(Guid id, [FromBody]Edit.Command command)
        {
            command.Id = id;
            var response = await Mediator.Send(command);
            return response;
        }

        [HttpDelete("{id:guid}")]
        [Authorize(Policy = "IsActivityHost")]
        public async Task<ActionResult<Unit>> Delete(Guid id)
        {
            return await Mediator.Send(new Delete.Command {Id = id});
        }

        [HttpPost("{id:guid}/attend")]
        public async Task<ActionResult<Unit>> Attend(Guid id) 
        {
            return await Mediator.Send(new Attend.Command {Id = id});
        }

        [HttpDelete("{id:guid}/unattend")]
        public async Task<ActionResult<Unit>> Unattend(Guid id) 
        {
            return await Mediator.Send(new Unattend.Command {Id = id});
        }
    }
}