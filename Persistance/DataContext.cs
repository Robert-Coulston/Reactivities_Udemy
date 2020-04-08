using System;
using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistance
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Value> Values { get; set; }
        public DbSet<Activity> Activities { get; set; }

        public DbSet<UserActivity> UserActivities { get; set; }

        public DbSet<Photo> Photos { get; set; }
        public DbSet<Comment> Comments { get; set; }

        public DbSet<UserFollowing> Followings { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Value>()
            .HasData(
                new Value { Id = 1, Name = "Value 101" },
                new Value { Id = 2, Name = "Value 102" },
                new Value { Id = 3, Name = "Value 103" },
                new Value { Id = 5, Name = "Value 105" }
            );

            builder.Entity<Activity>().HasIndex(t => new { t.Title });

            builder.Entity<UserActivity>(x => x.HasKey(ua => new { ua.AppUserId, ua.ActivityId }));

            builder.Entity<UserActivity>()
            .HasOne(u => u.AppUser)
            .WithMany(a => a.UserActivities)
            .HasForeignKey(u => u.AppUserId);

            builder.Entity<UserActivity>()
            .HasOne(a => a.Activity)
            .WithMany(u => u.UserActivities)
            .HasForeignKey(a => a.ActivityId);

            builder.Entity<UserFollowing>(x => x.HasKey(k => new { k.TargetId, k.ObserverId }));

            builder.Entity<UserFollowing>()
            .HasOne(x => x.Observer)
            .WithMany(x => x.Followings)
            .HasForeignKey(x => x.ObserverId)
            .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<UserFollowing>()
            .HasOne(x => x.Target)
            .WithMany(x => x.Followers)
            .HasForeignKey(x => x.TargetId)
            .OnDelete(DeleteBehavior.Restrict);

        }
    }
}
