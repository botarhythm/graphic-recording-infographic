document.addEventListener('DOMContentLoaded', () => {
    // 更新日を設定
    const lastUpdate = document.getElementById('lastUpdate');
    const today = new Date();
    lastUpdate.textContent = today.toLocaleDateString('ja-JP');

    // カードのアニメーション効果
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseover', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.transition = 'transform 0.3s ease';
        });
        
        card.addEventListener('mouseout', () => {
            card.style.transform = 'translateY(0)';
        });
    });
}); 