using Moq;
using ToDoList.Api.Data;
using ToDoList.Api.Services;
using ToDoList.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using ToDoList.Api.Models.Dtos;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace ToDoList.Api.Tests.Services
{
    public class ToDoServiceTests
    {
        private readonly Mock<ToDoListContext> _mockContext;
        private readonly ToDoService _toDoService;

        public ToDoServiceTests()
        {
            _mockContext = new Mock<ToDoListContext>(new DbContextOptions<ToDoListContext>());
            _toDoService = new ToDoService(_mockContext.Object);
        }

        [Fact]
        public async Task GetAll_ReturnsAllItems()
        {
            // Arrange
            var items = new List<ToDoItem>
            {
                new ToDoItem { Id = 1, Title = "Task 1", IsComplete = false },
                new ToDoItem { Id = 2, Title = "Task 2", IsComplete = true }
            };

            var mockSet = new Mock<DbSet<ToDoItem>>();
            mockSet.As<IAsyncEnumerable<ToDoItem>>()
                .Setup(m => m.GetAsyncEnumerator(It.IsAny<CancellationToken>()))
                .Returns(new MockAsyncEnumerator<ToDoItem>(items.GetEnumerator()));

            mockSet.As<IQueryable<ToDoItem>>()
                .Setup(m => m.Provider)
                .Returns(new MockAsyncQueryProvider<ToDoItem>(items.AsQueryable().Provider));

            mockSet.As<IQueryable<ToDoItem>>().Setup(m => m.Expression).Returns(items.AsQueryable().Expression);
            mockSet.As<IQueryable<ToDoItem>>().Setup(m => m.ElementType).Returns(items.AsQueryable().ElementType);
            mockSet.As<IQueryable<ToDoItem>>().Setup(m => m.GetEnumerator()).Returns(items.GetEnumerator());

            _mockContext.Setup(c => c.ToDoItems).Returns(mockSet.Object);

            // Act
            var result = await _toDoService.GetAll();

            // Assert
            Assert.Equal(2, result.Count());
        }

        [Fact]
        public async Task GetById_ReturnsCorrectItem()
        {
            // Arrange
            var itemId = 1;
            var items = new List<ToDoItem>
            {
                new ToDoItem { Id = itemId, Title = "Task 1", IsComplete = false, UserId = "user1" },
                new ToDoItem { Id = 2, Title = "Task 2", IsComplete = true, UserId = "user1" },
                new ToDoItem { Id = 3, Title = "Task 3", IsComplete = false, UserId = "user2" }
            }.AsQueryable();

            var mockSet = new Mock<DbSet<ToDoItem>>();
            mockSet.Setup(m => m.FindAsync(It.IsAny<object[]>()))
                .Returns<object[]>(ids => new ValueTask<ToDoItem?>(items.FirstOrDefault(i => i.Id == (int)ids[0])));

            _mockContext.Setup(c => c.ToDoItems).Returns(mockSet.Object);

            // Act
            var result = await _toDoService.GetById(itemId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(itemId, result.Id);
        }

        [Fact]
        public async Task GetByIdForUser_ReturnsCorrectItem()
        {
            // Arrange
            var userId = "user1";
            var itemId = 2;
            var items = new List<ToDoItem>
            {
                new ToDoItem { Id = 1, Title = "Task 1", IsComplete = false, UserId = userId },
                new ToDoItem { Id = itemId, Title = "Task 2", IsComplete = true, UserId = userId },
                new ToDoItem { Id = 3, Title = "Task 3", IsComplete = false, UserId = "user2" }
            }.AsQueryable();

            var mockSet = new Mock<DbSet<ToDoItem>>();
            mockSet.As<IAsyncEnumerable<ToDoItem>>()
                .Setup(m => m.GetAsyncEnumerator(It.IsAny<CancellationToken>()))
                .Returns(new MockAsyncEnumerator<ToDoItem>(items.GetEnumerator()));

            mockSet.As<IQueryable<ToDoItem>>()
                .Setup(m => m.Provider)
                .Returns(new MockAsyncQueryProvider<ToDoItem>(items.AsQueryable().Provider));

            mockSet.As<IQueryable<ToDoItem>>().Setup(m => m.Expression).Returns(items.AsQueryable().Expression);
            mockSet.As<IQueryable<ToDoItem>>().Setup(m => m.ElementType).Returns(items.AsQueryable().ElementType);
            mockSet.As<IQueryable<ToDoItem>>().Setup(m => m.GetEnumerator()).Returns(items.GetEnumerator());

            _mockContext.Setup(c => c.ToDoItems).Returns(mockSet.Object);

            // Act
            var result = await _toDoService.GetByIdForUser(itemId, userId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(itemId, result.Id);
            Assert.Equal(userId, result.UserId);
        }

        [Fact]
        public async Task Create_AddsItemToContext()
        {
            // Arrange
            var newItem = new ToDoItem { Id = 1, Title = "New Task", IsComplete = false, UserId = "user1" };
            var mockSet = new Mock<DbSet<ToDoItem>>();
            _mockContext.Setup(c => c.ToDoItems).Returns(mockSet.Object);

            // Act
            await _toDoService.Create(newItem);

            // Assert
            mockSet.Verify(m => m.Add(It.IsAny<ToDoItem>()), Times.Once());
            _mockContext.Verify(m => m.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once());
        }

        [Fact]
        public async Task Update_UpdatesCorrectly()
        {
            // Arrange
            var itemId = 1;
            var existingItem = new ToDoItem { Id = itemId, Title = "Original Title", IsComplete = false, UserId = "user1" };
            var updateDto = new UpdateToDoItemDto { Title = "Updated Title", IsComplete = true };

            var items = new List<ToDoItem> { existingItem }.AsQueryable();

            var mockSet = new Mock<DbSet<ToDoItem>>();
            mockSet.As<IQueryable<ToDoItem>>().Setup(m => m.Provider).Returns(new MockAsyncQueryProvider<ToDoItem>(items.Provider));
            mockSet.As<IQueryable<ToDoItem>>().Setup(m => m.Expression).Returns(items.Expression);
            mockSet.As<IQueryable<ToDoItem>>().Setup(m => m.ElementType).Returns(items.ElementType);
            mockSet.As<IQueryable<ToDoItem>>().Setup(m => m.GetEnumerator()).Returns(items.GetEnumerator());
            mockSet.Setup(m => m.FindAsync(It.IsAny<object[]>()))
                .Returns<object[]>(ids => new ValueTask<ToDoItem?>(items.FirstOrDefault(i => i.Id == (int)ids[0])));

            _mockContext.Setup(c => c.ToDoItems).Returns(mockSet.Object);
            _mockContext.Setup(c => c.Entry(It.IsAny<ToDoItem>())).Returns(new FakeEntityEntry<ToDoItem>(existingItem));

            existingItem.Title = updateDto.Title;
            existingItem.IsComplete = updateDto.IsComplete.Value;

            // Act
            var result = await _toDoService.Update(existingItem);

            // Assert
            Assert.True(result);
            Assert.Equal("Updated Title", existingItem.Title);
            Assert.True(existingItem.IsComplete);
            _mockContext.Verify(m => m.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once());
        }

        [Fact]
        public async Task UpdateForUser_UpdatesCorrectly()
        {
            // Arrange
            var userId = "user1";
            var itemId = 1;
            var existingItem = new ToDoItem { Id = itemId, Title = "Original Title", IsComplete = false, UserId = userId };
            var updateDto = new UpdateToDoItemDto { Title = "Updated Title", IsComplete = true };

            var items = new List<ToDoItem> { existingItem }.AsQueryable();

            var mockSet = new Mock<DbSet<ToDoItem>>();
            mockSet.As<IQueryable<ToDoItem>>().Setup(m => m.Provider).Returns(new MockAsyncQueryProvider<ToDoItem>(items.Provider));
            mockSet.As<IQueryable<ToDoItem>>().Setup(m => m.Expression).Returns(items.Expression);
            mockSet.As<IQueryable<ToDoItem>>().Setup(m => m.ElementType).Returns(items.ElementType);
            mockSet.As<IQueryable<ToDoItem>>().Setup(m => m.GetEnumerator()).Returns(items.GetEnumerator());
            mockSet.Setup(m => m.FindAsync(It.IsAny<object[]>()))
                .Returns<object[]>(ids => new ValueTask<ToDoItem?>(items.FirstOrDefault(i => i.Id == (int)ids[0])));

            _mockContext.Setup(c => c.ToDoItems).Returns(mockSet.Object);
            _mockContext.Setup(c => c.Entry(It.IsAny<ToDoItem>())).Returns(new FakeEntityEntry<ToDoItem>(existingItem));

            // Act
            var result = await _toDoService.UpdateForUser(itemId, userId, updateDto);

            // Assert
            Assert.True(result);
            Assert.Equal("Updated Title", existingItem.Title);
            Assert.True(existingItem.IsComplete);
            _mockContext.Verify(m => m.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once());
        }

        [Fact]
        public async Task Delete_DeletesCorrectly()
        {
            // Arrange
            var itemId = 1;
            var existingItem = new ToDoItem { Id = itemId, Title = "Task to Delete", IsComplete = false, UserId = "user1" };

            var items = new List<ToDoItem> { existingItem }.AsQueryable();

            var mockSet = new Mock<DbSet<ToDoItem>>();
            mockSet.As<IQueryable<ToDoItem>>().Setup(m => m.Provider).Returns(new MockAsyncQueryProvider<ToDoItem>(items.Provider));
            mockSet.As<IQueryable<ToDoItem>>().Setup(m => m.Expression).Returns(items.Expression);
            mockSet.As<IQueryable<ToDoItem>>().Setup(m => m.ElementType).Returns(items.ElementType);
            mockSet.As<IQueryable<ToDoItem>>().Setup(m => m.GetEnumerator()).Returns(items.GetEnumerator());
            mockSet.Setup(m => m.FindAsync(It.IsAny<object[]>()))
                .Returns<object[]>(ids => new ValueTask<ToDoItem?>(items.FirstOrDefault(i => i.Id == (int)ids[0])));

            _mockContext.Setup(c => c.ToDoItems).Returns(mockSet.Object);

            // Act
            await _toDoService.Delete(itemId);

            // Assert
            mockSet.Verify(m => m.Remove(It.IsAny<ToDoItem>()), Times.Once());
            _mockContext.Verify(m => m.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once());
        }

        [Fact]
        public async Task DeleteForUser_DeletesCorrectly()
        {
            // Arrange
            var userId = "user1";
            var itemId = 1;
            var existingItem = new ToDoItem { Id = itemId, Title = "Task to Delete", IsComplete = false, UserId = userId };

            var items = new List<ToDoItem> { existingItem }.AsQueryable();

            var mockSet = new Mock<DbSet<ToDoItem>>();
            mockSet.As<IQueryable<ToDoItem>>().Setup(m => m.Provider).Returns(new MockAsyncQueryProvider<ToDoItem>(items.Provider));
            mockSet.As<IQueryable<ToDoItem>>().Setup(m => m.Expression).Returns(items.Expression);
            mockSet.As<IQueryable<ToDoItem>>().Setup(m => m.ElementType).Returns(items.ElementType);
            mockSet.As<IQueryable<ToDoItem>>().Setup(m => m.GetEnumerator()).Returns(items.GetEnumerator());
            mockSet.Setup(m => m.FindAsync(It.IsAny<object[]>()))
                .Returns<object[]>(ids => new ValueTask<ToDoItem?>(items.FirstOrDefault(i => i.Id == (int)ids[0])));

            _mockContext.Setup(c => c.ToDoItems).Returns(mockSet.Object);

            // Act
            var result = await _toDoService.DeleteForUser(itemId, userId);

            // Assert
            Assert.True(result);
            mockSet.Verify(m => m.Remove(It.IsAny<ToDoItem>()), Times.Once());
            _mockContext.Verify(m => m.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once());
        }
    }

    public class FakeEntityEntry<T> : EntityEntry<T> where T : class
    {
        public FakeEntityEntry(T? entity) : base(null!)
        {
            Entity = entity!;
        }

        public override T Entity { get; }
        public override EntityState State { get; set; }
    }

    public class MockAsyncQueryProvider<TEntity> : IAsyncQueryProvider
    {
        private readonly IQueryProvider _inner;

        public MockAsyncQueryProvider(IQueryProvider inner)
        {
            _inner = inner;
        }

        public IQueryable CreateQuery(Expression expression)
        {
            return new MockAsyncEnumerable<TEntity>(expression);
        }

        public IQueryable<TElement> CreateQuery<TElement>(Expression expression)
        {
            return new MockAsyncEnumerable<TElement>(expression);
        }

        public object? Execute(Expression expression)
        {
            return _inner.Execute(expression);
        }

        public TResult Execute<TResult>(Expression expression)
        {
            return _inner.Execute<TResult>(expression);
        }

        public TResult ExecuteAsync<TResult>(Expression expression, CancellationToken cancellationToken = default)
        {
            var expectedResultType = typeof(TResult).GetGenericArguments()[0];
            var executionResult = typeof(IQueryProvider)
                                 .GetMethod(
                                     name: nameof(IQueryProvider.Execute),
                                     genericParameterCount: 1,
                                     types: new[] { typeof(Expression) }
                                 )
                                 !.MakeGenericMethod(expectedResultType)
                                 .Invoke(this, new[] { expression });

            return (TResult)typeof(Task).GetMethod(nameof(Task.FromResult))
                                          !.MakeGenericMethod(expectedResultType)
                                          .Invoke(null, new[] { executionResult })!;
        }
    }

    public class MockAsyncEnumerable<T> : EnumerableQuery<T>, IAsyncEnumerable<T>, IQueryable<T>
    {
        public MockAsyncEnumerable(IEnumerable<T> enumerable) : base(enumerable)
        { }

        public MockAsyncEnumerable(Expression expression) : base(expression)
        { }

        public IAsyncEnumerator<T> GetAsyncEnumerator(CancellationToken cancellationToken = default)
        {
            return new MockAsyncEnumerator<T>(this.AsEnumerable().GetEnumerator());
        }

        IQueryProvider IQueryable.Provider => new MockAsyncQueryProvider<T>(this);
    }

    public class MockAsyncEnumerator<T> : IAsyncEnumerator<T>
    {
        private readonly IEnumerator<T> _inner;

        public MockAsyncEnumerator(IEnumerator<T> inner)
        {
            _inner = inner;
        }

        public ValueTask<bool> MoveNextAsync()
        {
            return new ValueTask<bool>(_inner.MoveNext());
        }

        public T Current => _inner.Current;

        public ValueTask DisposeAsync()
        {
            _inner.Dispose();
            return new ValueTask();
        }
    }
}