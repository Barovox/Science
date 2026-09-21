using System;
using System.Linq;

namespace QLKHCN_API.Extensions
{
    public static class UpdateHelper
    {
        public static void AutoMapNotNull<T>(this T source, T target, params string[] ignoreProps)
        {
            var props = typeof(T).GetProperties();
            foreach (var prop in props)
            {
                if (!ignoreProps.Contains(prop.Name))
                {
                    var newValue = prop.GetValue(source);
                    var type = prop.PropertyType;

                    if (type.IsValueType)
                    {
                        if (Nullable.GetUnderlyingType(type) != null)
                        {
                            if (newValue != null)
                                prop.SetValue(target, newValue);
                        }
                        else
                        {
                            if (!newValue.Equals(Activator.CreateInstance(type)))
                                prop.SetValue(target, newValue);
                        }
                    }
                    else
                    {
                        if (newValue != null)
                            prop.SetValue(target, newValue);
                    }
                }
            }
        }
    }

}
