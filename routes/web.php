<?php

use Illuminate\Support\Facades\Route;

// Admin
use App\Http\Controllers\Admin\AboutusController as AdminAboutusController;
use App\Http\Controllers\Admin\HomeController as AdminHomeController;
use App\Http\Controllers\Admin\LandingHomeController as AdminLandingHomeController;
use App\Http\Controllers\Admin\ServiceController as AdminServiceController;
use App\Http\Controllers\Admin\FacilityController as AdminFacilityController;
use App\Http\Controllers\Admin\StaffController as AdminStaffController;
use App\Http\Controllers\Admin\SpecialityController as AdminSpecialityController;
use App\Http\Controllers\Admin\LangController as AdminLangController;
use App\Http\Controllers\Admin\AppointmentController as AdminAppointmentController;

use App\Http\Controllers\Admin\IndicatorController as AdminIndicatorController;
use App\Http\Controllers\Admin\SliderController as AdminSliderController;
use App\Http\Controllers\Admin\TestimonyController as AdminTestimonyController;
use App\Http\Controllers\Admin\SubscriptionController as AdminSubscriptionController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\ComplaintController as AdminComplaintController;
use App\Http\Controllers\Admin\PostController as AdminPostController;
use App\Http\Controllers\Admin\SocialController as AdminSocialController;
use App\Http\Controllers\Admin\TranslationController as AdminTranslationController;
use App\Http\Controllers\Admin\StrengthController as AdminStrengthController;
use App\Http\Controllers\Admin\CoreValueController as AdminCoreValueController;
use App\Http\Controllers\Admin\GeneralController as AdminGeneralController;
use App\Http\Controllers\Admin\ProfileController as AdminProfileController;
use App\Http\Controllers\Admin\AccountController as AdminAccountController;
use App\Http\Controllers\Admin\ItemController as AdminItemController;
use App\Http\Controllers\Admin\ItemColorController as AdminItemColorController;
use App\Http\Controllers\Admin\InstagramPostController as AdminInstagramPostsController;
use App\Http\Controllers\Admin\ItemSizeController as AdminItemSizeController;
use App\Http\Controllers\Admin\FaqController as AdminFaqController;
use App\Http\Controllers\Admin\FormulaController as AdminFormulaController;
use App\Http\Controllers\Admin\SupplyController as AdminSupplyController;
use App\Http\Controllers\Admin\TagController as AdminTagController;
use App\Http\Controllers\Admin\AdController as AdminAdController;
use App\Http\Controllers\Admin\FragranceController as AdminFragranceController;
use App\Http\Controllers\Admin\RenewalController as AdminRenewalController;
use App\Http\Controllers\Admin\BundleController as AdminBundleController;
use App\Http\Controllers\Admin\CouponController as AdminCouponController;
use App\Http\Controllers\Admin\SaleController as AdminSaleController;
use App\Http\Controllers\Admin\UserController as AdminUserController;

// Public 
use App\Http\Controllers\HomeController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AboutController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\CatalogController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ComplaintController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DetailController;
use App\Http\Controllers\FacilityController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\FormulaController;
use App\Http\Controllers\InstructionController;
use App\Http\Controllers\LoginVuaController;
use App\Http\Controllers\MyAccountController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\PopupController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\SupplyController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\TestResultController;
use App\Http\Controllers\ThankController;
use App\Http\Controllers\PolicyController;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/
// routes/api.php (o web.php)
// routes/web.php
Route::post('/set-current-lang', function (Request $request) {
   // dump($request->all());
    $request->validate(['lang_id' => 'required|exists:langs,id']);
    session(['current_lang_id' => $request->lang_id]);
   // dump(session('current_lang_id'));
    return response()->json(['success' => true]);
})->middleware('web'); // <-- El middleware 'web' es clave

// Public routes
Route::get('/', [HomeController::class, 'reactView'])->name('Home.jsx');
Route::get('/about', [AboutController::class, 'reactView'])->name('FisioTerapiaPage.jsx');
Route::get('/contact', [ContactController::class, 'reactView'])->name('Contacto.jsx');
Route::get('/offices', [FacilityController::class, 'reactView'])->name('InstalacionesPage.jsx');
Route::get('/services/{slug?}', [ServiceController::class, 'reactView'])->name('ServiciosPage.jsx');
Route::get('/catalog', [CatalogController::class, 'reactView'])->name('CatalogProducts.jsx');
Route::get('/instructions', [InstructionController::class, 'reactView'])->name('Instructions.jsx');
Route::get('/quiz', [CatalogController::class, 'reactView'])->name('Quiz.jsx');
Route::get('/product/{slug}', [DetailController::class, 'reactView'])->name('DetailProduct.jsx');

Route::get('/plans', [PlanController::class, 'reactView'])->name('Plans.jsx');
Route::get('/supplies', [SupplyController::class, 'reactView'])->name('Supplies.jsx');
Route::get('/faqs', [FaqController::class, 'reactView'])->name('FAQs.jsx');
Route::get('/test', [TestController::class, 'reactView'])->name('Test.jsx');
Route::get('/test/result/{formula}', [TestResultController::class, 'reactView'])->name('TestResult.jsx');
//Route::get('/about', [AboutController::class, 'reactView'])->name('About.jsx');
Route::get('/blog', [BlogController::class, 'reactView'])->name('Blog.jsx');
Route::get('/blog/{slug}', [ArticleController::class, 'reactView'])->name('BlogArticle.jsx');
Route::get('/contacto', [ContactController::class, 'reactView'])->name('Contact.jsx');
Route::get('/libro-de-reclamaciones', [ComplaintController::class, 'reactView'])->name('LibroDeReclamaciones.jsx');
Route::get('/policies/{policy}', [PolicyController::class, 'reactView'])->name('Policies.jsx');
// Vistas maquetadas finalizadas
Route::get('/checkout', [CheckoutController::class, 'reactView'])->name('Checkout.jsx');
Route::get('/formula/{formula}', [FormulaController::class, 'reactView'])->name('Formula.jsx');
Route::get('/thanks', [ThankController::class, 'reactView'])->name('Thanks.jsx');
Route::get('/loginvua', [LoginVuaController::class, 'reactView'])->name('LoginVua.jsx');
Route::get('/popup', [PopupController::class, 'reactView'])->name('Popup.jsx');

Route::get('/login', [AuthController::class, 'loginView'])->name('Login.jsx');
Route::get('/register', [AuthController::class, 'registerView'])->name('Register.jsx');
Route::get('/confirm-email/{token}', [AuthController::class, 'confirmEmailView'])->name('ConfirmEmail.jsx');
Route::get('/confirmation/{token}', [AuthController::class, 'loginView'])->name('confirmation');

Route::middleware(['auth', 'can:Customer'])->group(function () {
    Route::get('/my-account', [MyAccountController::class, 'reactView'])->name('MyAccount.jsx');
});
// Admin routes
Route::middleware(['can:Admin', 'auth'])->prefix('admin')->group(function () {
    Route::get('/', fn() => redirect('Admin/Home.jsx'));
    Route::get('/home', [AdminHomeController::class, 'reactView'])->name('Admin/Home.jsx');
    Route::get('/landing_home', [AdminLandingHomeController::class, 'reactView'])->name('Admin/LandingHome.jsx');
    Route::get('/services', [AdminServiceController::class, 'reactView'])->name('Admin/Services.jsx');

    Route::get('/facilities', [AdminFacilityController::class, 'reactView'])->name('Admin/Facilities.jsx');
    Route::get('/staff', [AdminStaffController::class, 'reactView'])->name('Admin/Staff.jsx');
    Route::get('/specialities', [AdminSpecialityController::class, 'reactView'])->name('Admin/Specialities.jsx');
    Route::get('/langs', [AdminLangController::class, 'reactView'])->name('Admin/Langs.jsx');
    Route::get('/appointments', [AdminAppointmentController::class, 'reactView'])->name('Admin/Appointments.jsx');

    Route::get('/sales', [AdminSaleController::class, 'reactView'])->name('Admin/Sales.jsx');
    Route::get('/posts', [AdminPostController::class, 'reactView'])->name('Admin/Posts.jsx');
    Route::get('/items', [AdminItemController::class, 'reactView'])->name('Admin/Items.jsx');
    Route::get('/colors', [AdminItemColorController::class, 'reactView'])->name('Admin/Colors.jsx');
    Route::get('/instagram_posts', [AdminInstagramPostsController::class, 'reactView'])->name('Admin/InstagramPosts.jsx');
    Route::get('/sizes', [AdminItemSizeController::class, 'reactView'])->name('Admin/Sizes.jsx');
    Route::get('/supplies', [AdminSupplyController::class, 'reactView'])->name('Admin/Supplies.jsx');
    Route::get('/gifts', [AdminSupplyController::class, 'reactView'])->name('Admin/Gifts.jsx');
    Route::get('/formulas', [AdminFormulaController::class, 'reactView'])->name('Admin/Formulas.jsx');
    Route::get('/fragrances', [AdminFragranceController::class, 'reactView'])->name('Admin/Fragrances.jsx');
    Route::get('/ads', [AdminAdController::class, 'reactView'])->name('Admin/Ads.jsx');
    Route::get('/renewals', [AdminRenewalController::class, 'reactView'])->name('Admin/Renewals.jsx');
    Route::get('/bundles', [AdminBundleController::class, 'reactView'])->name('Admin/Bundles.jsx');
    Route::get('/coupons', [AdminCouponController::class, 'reactView'])->name('Admin/Coupons.jsx');
    Route::get('/messages', [AdminSubscriptionController::class, 'reactView'])->name('Admin/Messages.jsx');
    Route::get('/subscriptions', [AdminSubscriptionController::class, 'reactView'])->name('Admin/Subscriptions.jsx');
    Route::get('/about', [AdminAboutusController::class, 'reactView'])->name('Admin/About.jsx');
    Route::get('/indicators', [AdminIndicatorController::class, 'reactView'])->name('Admin/Indicators.jsx');
    Route::get('/sliders', [AdminSliderController::class, 'reactView'])->name('Admin/Sliders.jsx');
    Route::get('/testimonies', [AdminTestimonyController::class, 'reactView'])->name('Admin/Testimonies.jsx');
    Route::get('/categories', [AdminCategoryController::class, 'reactView'])->name('Admin/Categories.jsx');
    Route::get('/complaints', [AdminComplaintController::class, 'reactView'])->name('Admin/Complaints.jsx');

    Route::get('/tags', [AdminTagController::class, 'reactView'])->name('Admin/Tags.jsx');
    Route::get('/faqs', [AdminFaqController::class, 'reactView'])->name('Admin/Faqs.jsx');
    Route::get('/socials', [AdminSocialController::class, 'reactView'])->name('Admin/Socials.jsx');
    Route::get('/translations', [AdminTranslationController::class, 'reactView'])->name('Admin/Translations.jsx');
    Route::get('/strengths', [AdminStrengthController::class, 'reactView'])->name('Admin/Strengths.jsx');
    Route::get('/core_values', [AdminCoreValueController::class, 'reactView'])->name('Admin/CoreValues.jsx');
    Route::get('/generals', [AdminGeneralController::class, 'reactView'])->name('Admin/Generals.jsx');
    Route::get('/users', [AdminUserController::class, 'reactView'])->name('Admin/Users.jsx');

    Route::get('/profile', [AdminProfileController::class, 'reactView'])->name('Admin/Profile.jsx');
    Route::get('/account', [AdminAccountController::class, 'reactView'])->name('Admin/Account.jsx');
});


Route::get('/mailing/new-formula', fn() => view('mailing.new-formula'));
