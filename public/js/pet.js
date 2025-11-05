$(document).ready(function () {
  console.log("pet.js loaded");

 $(function () {
      const userId = sessionStorage.getItem('userId');
      if (!userId) {
        Swal.fire('Not logged in', 'Please login to choose a pet', 'warning').then(() => {
          window.location.href = 'login.html';
        });
        return;
      }

      $('.pet-choice').on('click', function () {
        const choice = $(this).data('choice');
        $('#selectedChoice').val(choice);
        $('#petNameInput').val('');
        $('#petNameModal').modal('show');
      });

      $('#confirmPetBtn').on('click', function () {
        const petName = $('#petNameInput').val().trim();
        const choice = $('#selectedChoice').val();
        if (!petName) {
          Swal.fire('Please name your pet', '', 'info');
          return;
        }

        const payload = { user_id: parseInt(userId, 10), pet_name: petName, choice };
        $.ajax({
          method: 'POST',
          url: '/api/v1/pets',
          contentType: 'application/json',
          data: JSON.stringify(payload),
          success: function (res) {
            Swal.fire('Pet created!', 'Great choice — enjoy your pet.', 'success')
          },
          error: function (xhr) {
            Swal.fire('Error', xhr.responseJSON?.error || 'Failed to create pet', 'error');
          }
        });
      });

      $('#cancelPetBtn').on('click', () => $('#petNameModal').modal('hide'));
    });
 
});